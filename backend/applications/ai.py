from abc import ABC, abstractmethod
from dataclasses import dataclass
import json
import re
from urllib import error, request

from django.conf import settings
from rest_framework.exceptions import APIException


class AIServiceUnavailable(APIException):
    status_code = 503
    default_detail = "The AI screening service is temporarily unavailable. Please try again shortly."
    default_code = "AI_SERVICE_UNAVAILABLE"


@dataclass(frozen=True)
class EvaluationResult:
    evaluation: dict
    competency_signals: dict


class AIInterviewProvider(ABC):
    @abstractmethod
    def generate_questions(self, *, job: dict, candidate: dict, configuration: dict) -> list[dict]:
        raise NotImplementedError

    @abstractmethod
    def evaluate_answer(self, *, question: str, transcript: str, context: dict) -> EvaluationResult:
        raise NotImplementedError

    @abstractmethod
    def generate_follow_up(self, *, question: str, transcript: str, evaluation: dict, context: dict) -> dict | None:
        raise NotImplementedError

    @abstractmethod
    def summarize_interview(self, *, responses: list[dict], integrity_events: list[dict]) -> dict:
        raise NotImplementedError


class NativeInterviewProvider(AIInterviewProvider):
    """Senzoft-owned deterministic agent that runs without a model API."""

    def generate_questions(self, *, job: dict, candidate: dict, configuration: dict) -> list[dict]:
        maximum = min(int(configuration.get("maximum_questions", 5)), 10)
        skills = job.get("required_skills") or candidate.get("skills") or ["your core skills"]
        templates = [
            ("EXPERIENCE", f"Tell us about experience most relevant to the {job.get('title', 'role')} position."),
            ("TECHNICAL", f"Describe a challenging problem you solved using {skills[0]}."),
            ("PROJECT", "Walk through a project where your decisions materially affected the outcome."),
            ("BEHAVIORAL", "Describe a time you received difficult feedback and how you responded."),
            ("TECHNICAL", f"How would you approach a production issue involving {skills[-1]}?"),
        ]
        return [{"question": text, "category": category, "difficulty": configuration.get("difficulty", "MEDIUM"), "metadata": {"provider": "native", "agent": "question_planner"}} for category, text in templates[:maximum]]

    def evaluate_answer(self, *, question: str, transcript: str, context: dict) -> EvaluationResult:
        answer = transcript.strip()
        words = re.findall(r"[a-z0-9+#.-]+", answer.lower())
        word_count = len(words)
        answer_terms = set(words)
        question_terms = {
            token for token in re.findall(r"[a-z0-9+#.-]+", question.lower())
            if len(token) > 3
        }
        raw_skills = context.get("job", {}).get("required_skills") or []
        if isinstance(raw_skills, str):
            raw_skills = [item.strip() for item in raw_skills.split(",") if item.strip()]
        skill_matches = [str(skill) for skill in raw_skills if str(skill).lower() in answer.lower()]
        question_overlap = len(question_terms & answer_terms)
        evidence_markers = {
            "built", "designed", "implemented", "measured", "reduced", "improved",
            "resolved", "tested", "deployed", "result", "outcome", "because", "learned",
        }
        evidence_hits = sorted(evidence_markers & answer_terms)
        relevance = min(10, 2 + question_overlap + min(3, len(skill_matches)) + min(3, word_count // 30))
        technical = min(10, 2 + min(4, len(skill_matches) * 2) + min(2, len(evidence_hits)) + min(2, word_count // 45))
        communication = min(10, 3 + min(4, word_count // 25) + (1 if any(mark in answer for mark in (".", ";", ":")) else 0) + (1 if evidence_hits else 0))
        quality = round((relevance + technical + communication) / 3, 2)
        strengths = []
        if skill_matches:
            strengths.append("Referenced role-relevant skills: " + ", ".join(skill_matches[:4]))
        if evidence_hits:
            strengths.append("Included action or outcome evidence for recruiter review")
        if word_count >= 40:
            strengths.append("Provided a substantive response")
        concerns = []
        if word_count < 25:
            concerns.append("The response was brief and may need clarification")
        if not evidence_hits:
            concerns.append("A concrete action and measurable outcome were not clearly identified")
        evaluation = {
            "provider": "native",
            "agent": "answer_evaluator",
            "relevance_score": relevance,
            "technical_score": technical,
            "communication_score": communication,
            "answer_quality_score": quality,
            "strengths": strengths or ["Response recorded for human review"],
            "concerns": concerns,
            "evidence": evidence_hits,
            "follow_up_needed": word_count < 40 or not evidence_hits,
            "requires_human_review": True,
        }
        return EvaluationResult(
            evaluation=evaluation,
            competency_signals={
                "word_count": word_count,
                "role_skill_matches": skill_matches,
                "evidence_markers": evidence_hits,
            },
        )

    def generate_follow_up(self, *, question: str, transcript: str, evaluation: dict, context: dict) -> dict | None:
        if not evaluation.get("follow_up_needed"):
            return None
        missing = evaluation.get("concerns") or []
        prompt = "Could you add a specific example, explain what you personally did, and describe the result?"
        if missing and "brief" not in " ".join(missing).lower():
            prompt = "What concrete action did you take, and what measurable or observable result followed?"
        return {"question": prompt, "category": "EXPERIENCE", "difficulty": "MEDIUM", "metadata": {"adaptive": True, "provider": "native", "agent": "follow_up_planner"}}

    def summarize_interview(self, *, responses: list[dict], integrity_events: list[dict]) -> dict:
        scores = [float(item.get("score") or 0) for item in responses]
        overall = round(sum(scores) / len(scores), 2) if scores else 0
        strengths = []
        areas = []
        for item in responses:
            evaluation = item.get("evaluation") or {}
            strengths.extend(evaluation.get("strengths") or [])
            areas.extend(evaluation.get("concerns") or [])
        return {
            "provider": "native",
            "agent": "interview_summarizer",
            "overall_score": overall,
            "response_count": len(responses),
            "integrity_event_count": len(integrity_events),
            "summary": f"Recorded {len(responses)} structured responses for recruiter review.",
            "strengths": list(dict.fromkeys(strengths))[:5],
            "areas_for_review": list(dict.fromkeys(areas))[:5],
            "recommended_human_follow_ups": ["Validate the candidate's examples and claimed outcomes in the next round."],
            "requires_human_review": True,
            "decision": "HUMAN_REVIEW_REQUIRED",
        }


class OpenAICompatibleInterviewProvider(AIInterviewProvider):
    """Role-aware screening through an OpenAI-compatible endpoint such as Neon AI Gateway."""

    system_prompt = (
        "You are a structured first-round recruitment screening assistant for Senzoft Software Solutions. "
        "Evaluate only job-relevant evidence. Never infer or use protected characteristics. Never make a final "
        "hiring decision or automatically reject a candidate. Return valid JSON only and always require human review."
    )

    def __init__(self, *, base_url: str, token: str, model: str):
        if not base_url or not token or not model:
            raise RuntimeError("The configured AI provider is missing its URL, token, or model.")
        base = base_url.rstrip("/")
        self.url = base + "/chat/completions" if base.endswith("/v1") else base + "/v1/chat/completions"
        self.token = token
        self.model = model

    def _json(self, *, instruction: str, payload: dict) -> dict:
        body = json.dumps({
            "model": self.model,
            "temperature": 0.2,
            "messages": [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": instruction + "\nINPUT_JSON:\n" + json.dumps(payload, default=str)},
            ],
        }).encode("utf-8")
        call = request.Request(
            self.url,
            data=body,
            method="POST",
            headers={"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"},
        )
        try:
            with request.urlopen(call, timeout=45) as response:
                data = json.loads(response.read().decode("utf-8"))
        except (error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise AIServiceUnavailable() from exc
        try:
            content = data["choices"][0]["message"]["content"].strip()
            if content.startswith("```"):
                content = content.split("\n", 1)[1].rsplit("```", 1)[0]
            return json.loads(content)
        except (KeyError, IndexError, TypeError, json.JSONDecodeError) as exc:
            raise AIServiceUnavailable("The AI screening service returned an invalid structured response.") from exc

    @staticmethod
    def _score(value) -> float:
        try:
            return max(0.0, min(10.0, round(float(value), 2)))
        except (TypeError, ValueError):
            return 0.0

    def generate_questions(self, *, job: dict, candidate: dict, configuration: dict) -> list[dict]:
        maximum = max(1, min(int(configuration.get("maximum_questions", 5)), 10))
        result = self._json(
            instruction=(
                f"Create exactly {maximum} concise pre-screening questions tailored to this role and candidate. "
                "Cover relevant experience, technical skills, project judgment, and one behavioral scenario. "
                "Do not ask about age, family, health, religion, caste, ethnicity, gender, disability, or other protected data. "
                "Return {\"questions\":[{\"question\":str,\"category\":one of TECHNICAL|EXPERIENCE|PROJECT|BEHAVIORAL,"
                "\"difficulty\":one of EASY|MEDIUM|HARD}]}"
            ),
            payload={"job": job, "candidate": candidate, "configuration": configuration},
        )
        questions = []
        allowed_categories = {"TECHNICAL", "EXPERIENCE", "PROJECT", "BEHAVIORAL"}
        for item in result.get("questions", [])[:maximum]:
            text = str(item.get("question", "")).strip()[:2000]
            category = str(item.get("category", "EXPERIENCE")).upper()
            difficulty = str(item.get("difficulty", configuration.get("difficulty", "MEDIUM"))).upper()
            if text:
                questions.append({
                    "question": text,
                    "category": category if category in allowed_categories else "EXPERIENCE",
                    "difficulty": difficulty if difficulty in {"EASY", "MEDIUM", "HARD"} else "MEDIUM",
                    "metadata": {"provider": settings.AI_PROVIDER, "model": self.model, "round": 1},
                })
        if not questions:
            raise AIServiceUnavailable("The AI screening service did not generate any usable questions.")
        return questions

    def evaluate_answer(self, *, question: str, transcript: str, context: dict) -> EvaluationResult:
        result = self._json(
            instruction=(
                "Evaluate this answer only against the role and question. Return "
                "{\"relevance_score\":0-10,\"technical_score\":0-10,\"communication_score\":0-10,"
                "\"answer_quality_score\":0-10,\"strengths\":[str],\"concerns\":[str],\"evidence\":[str],"
                "\"follow_up_needed\":bool,\"competency_signals\":object,\"requires_human_review\":true}."
            ),
            payload={"question": question, "answer": transcript, "role_context": context},
        )
        evaluation = {
            **result,
            "provider": settings.AI_PROVIDER,
            "model": self.model,
            "relevance_score": self._score(result.get("relevance_score")),
            "technical_score": self._score(result.get("technical_score")),
            "communication_score": self._score(result.get("communication_score")),
            "answer_quality_score": self._score(result.get("answer_quality_score")),
            "requires_human_review": True,
        }
        signals = result.get("competency_signals") if isinstance(result.get("competency_signals"), dict) else {}
        return EvaluationResult(evaluation=evaluation, competency_signals=signals)

    def generate_follow_up(self, *, question: str, transcript: str, evaluation: dict, context: dict) -> dict | None:
        if not evaluation.get("follow_up_needed"):
            return None
        result = self._json(
            instruction=(
                "Write one short follow-up that asks for missing job-relevant evidence. Return "
                "{\"question\":str,\"category\":one of TECHNICAL|EXPERIENCE|PROJECT|BEHAVIORAL,\"difficulty\":MEDIUM}."
            ),
            payload={"question": question, "answer": transcript, "evaluation": evaluation, "role_context": context},
        )
        text = str(result.get("question", "")).strip()[:2000]
        if not text:
            return None
        category = str(result.get("category", "EXPERIENCE")).upper()
        return {"question": text, "category": category if category in {"TECHNICAL", "EXPERIENCE", "PROJECT", "BEHAVIORAL"} else "EXPERIENCE", "difficulty": "MEDIUM", "metadata": {"adaptive": True, "provider": settings.AI_PROVIDER, "model": self.model}}

    def summarize_interview(self, *, responses: list[dict], integrity_events: list[dict]) -> dict:
        result = self._json(
            instruction=(
                "Summarize the screening evidence for a human recruiter. Do not decide or auto-reject. Return "
                "{\"overall_score\":0-10,\"summary\":str,\"strengths\":[str],\"areas_for_review\":[str],"
                "\"recommended_human_follow_ups\":[str],\"requires_human_review\":true,"
                "\"decision\":\"HUMAN_REVIEW_REQUIRED\"}. Treat integrity events as review signals, not proof."
            ),
            payload={"responses": responses, "integrity_events": integrity_events},
        )
        return {
            **result,
            "provider": settings.AI_PROVIDER,
            "model": self.model,
            "overall_score": self._score(result.get("overall_score")),
            "response_count": len(responses),
            "integrity_event_count": len(integrity_events),
            "requires_human_review": True,
            "decision": "HUMAN_REVIEW_REQUIRED",
        }


class SpeechProvider(ABC):
    @abstractmethod
    def transcribe(self, payload: dict) -> str:
        raise NotImplementedError


class BrowserTranscriptProvider(SpeechProvider):
    """Accepts browser-generated text; no audio is uploaded or retained."""
    def transcribe(self, payload: dict) -> str:
        return str(payload.get("transcript", "")).strip()


class LocalOllamaInterviewProvider(AIInterviewProvider):
    """Use a local Ollama model and fall back to native rules if it is unavailable."""

    def __init__(self):
        self.local_model = OpenAICompatibleInterviewProvider(
            base_url=settings.OLLAMA_BASE_URL,
            token="ollama-local",
            model=settings.OLLAMA_MODEL,
        )
        self.fallback = NativeInterviewProvider()

    def _run(self, method, **kwargs):
        try:
            return getattr(self.local_model, method)(**kwargs)
        except AIServiceUnavailable:
            return getattr(self.fallback, method)(**kwargs)

    def generate_questions(self, *, job: dict, candidate: dict, configuration: dict) -> list[dict]:
        return self._run("generate_questions", job=job, candidate=candidate, configuration=configuration)

    def evaluate_answer(self, *, question: str, transcript: str, context: dict) -> EvaluationResult:
        return self._run("evaluate_answer", question=question, transcript=transcript, context=context)

    def generate_follow_up(self, *, question: str, transcript: str, evaluation: dict, context: dict) -> dict | None:
        return self._run("generate_follow_up", question=question, transcript=transcript, evaluation=evaluation, context=context)

    def summarize_interview(self, *, responses: list[dict], integrity_events: list[dict]) -> dict:
        return self._run("summarize_interview", responses=responses, integrity_events=integrity_events)


def get_ai_provider():
    if settings.AI_PROVIDER.lower() in {"ollama", "local"}:
        return LocalOllamaInterviewProvider()
    if settings.AI_PROVIDER.lower() in {"neon", "openai_compatible"}:
        return OpenAICompatibleInterviewProvider(
            base_url=settings.AI_SERVICE_URL,
            token=settings.AI_SERVICE_TOKEN,
            model=settings.AI_MODEL,
        )
    return NativeInterviewProvider()


def get_speech_provider():
    return BrowserTranscriptProvider()
