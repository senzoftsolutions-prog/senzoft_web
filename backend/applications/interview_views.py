from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework import generics, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from audit.services import write_audit
from core.permissions import IsCandidate
from .ai import get_ai_provider, get_speech_provider
from .models import IntegrityEvent, Interview, InterviewEvaluation, InterviewQuestion, InterviewResponse
from .serializers import IntegrityEventCreateSerializer, IntegrityEventSerializer, InterviewQuestionSerializer, InterviewResponseSubmitSerializer, InterviewSessionSerializer
from notifications.email import send_interview_update


def candidate_interviews(user):
    return Interview.objects.filter(application__candidate__user=user).select_related("application__candidate", "application__job").prefetch_related("questions__response", "responses", "integrity_events")


def interview_context(interview):
    job, candidate = interview.application.job, interview.application.candidate
    return {
        "job": {"title": job.title, "description": job.description, "responsibilities": job.responsibilities, "required_skills": job.required_skills, "preferred_skills": job.preferred_skills, "qualifications": job.qualifications, "experience": [job.minimum_experience, job.maximum_experience]},
        "candidate": {"skills": candidate.skills, "experience": candidate.experience, "education": candidate.education, "summary": candidate.professional_summary, "resume": candidate.resume_metadata},
    }


class CandidateInterviewSessionView(generics.RetrieveAPIView):
    serializer_class = InterviewSessionSerializer
    permission_classes = [IsCandidate]
    lookup_field = "public_id"
    lookup_url_kwarg = "interview_id"
    def get_queryset(self):
        return candidate_interviews(self.request.user)


class CandidateInterviewStartView(APIView):
    permission_classes = [IsCandidate]
    throttle_scope = "interview"

    def post(self, request, interview_id):
        with transaction.atomic():
            interview = generics.get_object_or_404(candidate_interviews(request.user).select_for_update(), public_id=interview_id)
            if interview.expires_at and interview.expires_at <= timezone.now():
                if interview.status in {Interview.Status.CREATED, Interview.Status.SCHEDULED, Interview.Status.READY}:
                    interview.status = Interview.Status.EXPIRED
                    interview.save(update_fields=("status", "updated_at"))
                return Response({"detail": "This interview has expired."}, status=status.HTTP_410_GONE)
            if interview.status == Interview.Status.SCHEDULED:
                interview.transition_to(Interview.Status.READY)
            if interview.status == Interview.Status.CREATED:
                interview.transition_to(Interview.Status.READY)
            if interview.status == Interview.Status.READY:
                config = {**settings.AI_INTERVIEW_DEFAULTS, **interview.configuration}
                if not interview.questions.exists():
                    context = interview_context(interview)
                    questions = get_ai_provider().generate_questions(job=context["job"], candidate=context["candidate"], configuration=config)
                    InterviewQuestion.objects.bulk_create([InterviewQuestion(interview=interview, sequence=index + 1, **question) for index, question in enumerate(questions[:config["maximum_questions"]])])
                    interview._prefetched_objects_cache = {}
                interview.configuration = config
                interview.transition_to(Interview.Status.IN_PROGRESS)
                write_audit(actor=request.user, action="INTERVIEW_STARTED", entity="Interview", entity_id=interview.public_id)
                send_interview_update(interview=interview)
            elif interview.status != Interview.Status.IN_PROGRESS:
                return Response({"detail": f"Interview cannot start from {interview.status}."}, status=status.HTTP_409_CONFLICT)
        return Response(InterviewSessionSerializer(interview).data)


class CandidateInterviewResponseView(APIView):
    permission_classes = [IsCandidate]
    throttle_scope = "interview"

    def post(self, request, interview_id):
        submitted = InterviewResponseSubmitSerializer(data=request.data)
        submitted.is_valid(raise_exception=True)
        with transaction.atomic():
            interview = generics.get_object_or_404(candidate_interviews(request.user).select_for_update(), public_id=interview_id)
            if interview.status != Interview.Status.IN_PROGRESS:
                return Response({"detail": "Interview is not in progress."}, status=status.HTTP_409_CONFLICT)
            question = generics.get_object_or_404(InterviewQuestion.objects.filter(interview=interview), id=submitted.validated_data["question_id"])
            if InterviewResponse.objects.filter(question_record=question).exists():
                return Response({"detail": "This question was already answered."}, status=status.HTTP_409_CONFLICT)
            transcript = get_speech_provider().transcribe({"transcript": submitted.validated_data["transcript"]})
            if not transcript:
                raise serializers.ValidationError({"transcript": "A transcript is required."})
            context = interview_context(interview)
            result = get_ai_provider().evaluate_answer(question=question.question, transcript=transcript, context=context)
            score = Decimal(str(result.evaluation.get("answer_quality_score", 0)))
            response = InterviewResponse.objects.create(interview=interview, question_record=question, question=question.question, transcript=transcript, evaluation=result.evaluation, competency_signals=result.competency_signals, score=score)
            config = interview.configuration
            question_count = interview.questions.count()
            if question_count < config.get("maximum_questions", 5):
                follow_up = get_ai_provider().generate_follow_up(question=question.question, transcript=transcript, evaluation=result.evaluation, context=context)
                if follow_up:
                    InterviewQuestion.objects.create(interview=interview, sequence=question_count + 1, **follow_up)
        return Response({"response_id": response.id, "evaluation_recorded": True, "next_question": InterviewQuestionSerializer(interview.questions.filter(response__isnull=True).first()).data if interview.questions.filter(response__isnull=True).exists() else None}, status=status.HTTP_201_CREATED)


class CandidateInterviewIntegrityView(APIView):
    permission_classes = [IsCandidate]
    throttle_scope = "interview_events"

    def post(self, request, interview_id):
        interview = generics.get_object_or_404(candidate_interviews(request.user), public_id=interview_id)
        if interview.status != Interview.Status.IN_PROGRESS:
            return Response({"detail": "Integrity events are accepted only during an active interview."}, status=status.HTTP_409_CONFLICT)
        serializer = IntegrityEventCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = IntegrityEvent.objects.create(interview=interview, **serializer.validated_data)
        return Response(IntegrityEventSerializer(event).data, status=status.HTTP_201_CREATED)


class CandidateInterviewCompleteView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request, interview_id):
        with transaction.atomic():
            interview = generics.get_object_or_404(candidate_interviews(request.user).select_for_update(), public_id=interview_id)
            if interview.status == Interview.Status.COMPLETED:
                return Response(InterviewSessionSerializer(interview).data)
            if interview.status != Interview.Status.IN_PROGRESS:
                return Response({"detail": "Interview is not in progress."}, status=status.HTTP_409_CONFLICT)
            responses = list(interview.responses.all())
            minimum = interview.configuration.get("minimum_questions", 3)
            if len(responses) < minimum:
                return Response({"detail": f"Answer at least {minimum} questions before completing."}, status=status.HTTP_409_CONFLICT)
            events = list(interview.integrity_events.values("event_type", "severity", "occurred_at"))
            response_data = [{"score": item.score, "evaluation": item.evaluation} for item in responses]
            summary = get_ai_provider().summarize_interview(responses=response_data, integrity_events=events)
            avg = lambda key: round(sum(float(item.evaluation.get(key, 0)) for item in responses) / len(responses), 2)
            InterviewEvaluation.objects.update_or_create(interview=interview, defaults={"technical_score": avg("technical_score"), "communication_score": avg("communication_score"), "relevance_score": avg("relevance_score"), "overall_score": summary["overall_score"], "integrity_summary": {"event_count": len(events), "signals_are_not_proof": True}, "structured_result": summary})
            interview.final_result = summary
            interview.transition_to(Interview.Status.COMPLETED)
            write_audit(actor=request.user, action="INTERVIEW_COMPLETED", entity="Interview", entity_id=interview.public_id, metadata={"requires_human_review": True})
            send_interview_update(interview=interview)
        return Response(InterviewSessionSerializer(interview).data)
