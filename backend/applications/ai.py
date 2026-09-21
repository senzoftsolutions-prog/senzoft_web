from abc import ABC, abstractmethod
from dataclasses import dataclass


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


class MockAIInterviewProvider(AIInterviewProvider):
    """Development contract only; it does not make hiring decisions."""

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
        return [{"question": text, "category": category, "difficulty": configuration.get("difficulty", "MEDIUM"), "metadata": {"provider": "mock"}} for category, text in templates[:maximum]]

    def evaluate_answer(self, *, question: str, transcript: str, context: dict) -> EvaluationResult:
        word_count = len(transcript.split())
        quality = max(1, min(10, round(word_count / 12)))
        evaluation = {"provider": "mock", "relevance_score": quality, "technical_score": quality, "communication_score": min(10, quality + 1), "answer_quality_score": quality, "strengths": ["Answer was recorded for human review"] if word_count else [], "concerns": ["Answer was very brief"] if word_count < 20 else [], "evidence": [], "follow_up_needed": word_count < 35, "requires_human_review": True}
        return EvaluationResult(evaluation=evaluation, competency_signals={"word_count": word_count})

    def generate_follow_up(self, *, question: str, transcript: str, evaluation: dict, context: dict) -> dict | None:
        if not evaluation.get("follow_up_needed"):
            return None
        return {"question": "Could you add a specific example and explain the result?", "category": "EXPERIENCE", "difficulty": "MEDIUM", "metadata": {"adaptive": True, "provider": "mock"}}

    def summarize_interview(self, *, responses: list[dict], integrity_events: list[dict]) -> dict:
        scores = [float(item.get("score") or 0) for item in responses]
        overall = round(sum(scores) / len(scores), 2) if scores else 0
        return {"provider": "mock", "overall_score": overall, "response_count": len(responses), "integrity_event_count": len(integrity_events), "requires_human_review": True, "decision": "HUMAN_REVIEW_REQUIRED"}


class SpeechProvider(ABC):
    @abstractmethod
    def transcribe(self, payload: dict) -> str:
        raise NotImplementedError


class BrowserTranscriptProvider(SpeechProvider):
    """Accepts browser-generated text; no audio is uploaded or retained."""
    def transcribe(self, payload: dict) -> str:
        return str(payload.get("transcript", "")).strip()


def get_ai_provider():
    return MockAIInterviewProvider()


def get_speech_provider():
    return BrowserTranscriptProvider()
