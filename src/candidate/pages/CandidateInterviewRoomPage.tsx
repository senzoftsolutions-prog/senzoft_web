import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { VoiceBeam } from "voice-glow";
import {
  Bot,
  CheckCircle2,
  Mic,
  MicOff,
  RefreshCw,
  ShieldAlert,
  Volume2,
} from "lucide-react";
import {
  completeInterview,
  getInterviewSession,
  startInterview,
  submitInterviewResponse,
  type InterviewQuestion,
  type InterviewSession,
} from "../../services/api/candidate";
import { CandidateStatus } from "../CandidateUI";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult:
    | ((event: {
        resultIndex: number;
        results: ArrayLike<{ 0: { transcript: string } }>;
      }) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};
export default function CandidateInterviewRoomPage() {
  const { id = "" } = useParams();
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [permission, setPermission] = useState<
    "idle" | "checking" | "ready" | "denied" | "unavailable"
  >("idle");
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [microphoneStream, setMicrophoneStream] = useState<MediaStream | null>(
    null,
  );
  const [interviewMode, setInterviewMode] = useState<"agent" | "guided">(
    "agent",
  );
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const load = async () => {
    try {
      const nextSession = await getInterviewSession(id);
      setSession(nextSession);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to load interview.",
      );
    }
  };
  useEffect(() => {
    void load();
    return () => {
      window.speechSynthesis?.cancel();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [id]);
  const checkDevices = async () => {
    setPermission("checking");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      setMicrophoneStream(stream);
      setPermission("ready");
    } catch (reason) {
      const denied =
        reason instanceof DOMException && reason.name === "NotAllowedError";
      setMicrophoneStream(null);
      setPermission(denied ? "denied" : "unavailable");
      setError(
        denied
          ? "Microphone permission was denied. Enable microphone access in browser settings and retry."
          : "A microphone is unavailable on this device.",
      );
    }
  };
  const begin = async () => {
    if (permission !== "ready" || !consent) return;
    setSaving(true);
    setError("");
    try {
      const activeSession = await startInterview(id);
      setSession(activeSession);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to start interview.",
      );
    } finally {
      setSaving(false);
    }
  };
  const current: InterviewQuestion | undefined = session?.questions.find(
    (question) => !question.answered,
  );
  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) {
      setError(
        "Speech playback is unavailable in this browser. The question remains visible on screen.",
      );
      return;
    }
    window.speechSynthesis.cancel();
    recognitionRef.current?.stop();
    setListening(false);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.94;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((voice) => voice.lang.toLowerCase() === "en-in") ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ||
      null;
    utterance.onstart = () => setAgentSpeaking(true);
    utterance.onend = () => setAgentSpeaking(false);
    utterance.onerror = () => setAgentSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);
  useEffect(() => {
    if (
      session?.status !== "IN_PROGRESS" ||
      interviewMode !== "agent" ||
      !current
    )
      return;
    const introduction =
      current.sequence === 1
        ? `Hello ${session.candidate_name}. Welcome to your first-round interview for the ${session.job_title} role at Senzoft Software Solutions. `
        : "Here is your next question. ";
    const timer = window.setTimeout(
      () => speak(`${introduction}${current.question}`),
      350,
    );
    return () => window.clearTimeout(timer);
  }, [
    current,
    interviewMode,
    session?.candidate_name,
    session?.job_title,
    session?.status,
    speak,
  ]);
  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    window.speechSynthesis?.cancel();
    setAgentSpeaking(false);
    const source = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechCtor =
      source.SpeechRecognition || source.webkitSpeechRecognition;
    if (!SpeechCtor) {
      setError(
        "Live browser speech recognition is unavailable. Type your answer instead.",
      );
      return;
    }
    const recognition = new SpeechCtor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";
    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++)
        text += event.results[i][0].transcript + " ";
      setTranscript((value) => (value + " " + text).trim());
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      setError("Speech recognition stopped. You can continue by typing.");
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };
  const submit = async () => {
    if (!current || !transcript.trim() || saving) return;
    recognitionRef.current?.stop();
    setListening(false);
    window.speechSynthesis?.cancel();
    setAgentSpeaking(false);
    setSaving(true);
    setError("");
    try {
      await submitInterviewResponse(id, current.id, transcript.trim());
      setTranscript("");
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to submit answer.",
      );
    } finally {
      setSaving(false);
    }
  };
  const complete = async () => {
    setSaving(true);
    setError("");
    try {
      setSession(await completeInterview(id));
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setMicrophoneStream(null);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to complete interview.",
      );
    } finally {
      setSaving(false);
    }
  };
  if (!session && !error)
    return <div className="candidate-state">Loading interview…</div>;
  if (!session)
    return (
      <div className="candidate-state error">
        <p>{error}</p>
        <button onClick={() => void load()}>Retry</button>
      </div>
    );
  if (session.status === "COMPLETED")
    return (
      <section className="interview-complete">
        <CheckCircle2 />
        <h1>Interview completed</h1>
        <p>
          Your structured responses are available to the recruitment team for
          human review. AI output is not an automatic hiring decision.
        </p>
        <Link className="candidate-btn primary" to="/candidate/interviews">
          Back to interviews
        </Link>
      </section>
    );
  const answered = session.responses.length,
    total =
      session.questions.length ||
      Number(session.configuration.maximum_questions || 0);
  return (
    <section className="interview-room">
      <header className="interview-header">
        <div>
          <p className="candidate-kicker">First round · AI pre-screening</p>
          <h1>{session.job_title}</h1>
          <p>{session.id}</p>
        </div>
        <div>
          <CandidateStatus value={session.status} />
          <strong>
            {interviewMode === "agent" && session.status === "IN_PROGRESS"
              ? `Senzoft agent: ${saving ? "thinking" : agentSpeaking ? "speaking" : listening ? "listening" : "ready"}`
              : `${answered} / ${total} answered`}
          </strong>
        </div>
      </header>
      <div className="interview-progress">
        <span
          style={{
            width: `${total ? Math.min(100, (answered / total) * 100) : 0}%`,
          }}
        />
      </div>
      {error && (
        <div className="candidate-form-error" role="alert">
          {error}
        </div>
      )}
      <div className="interview-grid">
        <aside className="interview-camera interview-microphone">
          <div className="voice-agent-orb">
            <Mic />
          </div>
          <div className="camera-status">
            <Mic />
            <span>Microphone: {permission}</span>
            {listening ? <Mic /> : <MicOff />}
          </div>
          {permission !== "ready" && (
            <div className="camera-overlay">
              <ShieldAlert />
              <p>
                Only microphone access is requested. Your audio is converted to
                text in the browser and no audio or video recording is stored.
              </p>
              <button
                className="candidate-btn secondary"
                onClick={() => void checkDevices()}
                disabled={permission === "checking"}
              >
                <RefreshCw />{" "}
                {permission === "checking" ? "Checking…" : "Check microphone"}
              </button>
            </div>
          )}
        </aside>
        <main className="interview-question">
          {session.status !== "IN_PROGRESS" ? (
            <>
              <p className="candidate-kicker">Before you begin</p>
              <h2>System check and interview guidance</h2>
              <ul>
                <li>
                  Questions are generated from the role requirements and your
                  submitted profile.
                </li>
                <li>
                  Use a quiet location and confirm that your microphone works.
                </li>
                <li>
                  Answer in your own words. Transcripts and AI evaluations are
                  retained for recruitment review.
                </li>
                <li>
                  AI results support a human recruiter and never make the final
                  hiring decision.
                </li>
                <li>
                  Camera access, fullscreen access, and screen monitoring are
                  not required.
                </li>
              </ul>
              <div
                className="interview-mode-picker"
                aria-label="Interview format"
              >
                <button
                  type="button"
                  className={interviewMode === "agent" ? "active" : ""}
                  onClick={() => setInterviewMode("agent")}
                >
                  <Bot />
                  <span>
                    <strong>Senzoft interview agent</strong>
                    Spoken questions with adaptive role-based follow-ups
                  </span>
                </button>
                <button
                  type="button"
                  className={interviewMode === "guided" ? "active" : ""}
                  onClick={() => setInterviewMode("guided")}
                >
                  <Mic />
                  <span>
                    <strong>Guided answers</strong>
                    Answer each question by voice-to-text or typing
                  </span>
                </button>
              </div>
              {interviewMode === "agent" && (
                <p className="interview-privacy-note">
                  This Senzoft-owned agent speaks locally through your browser.
                  Only your answer transcript is sent to the recruitment
                  backend; audio and video recordings are not stored.
                </p>
              )}
              <label className="interview-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                />
                <span>
                  I understand and consent to this AI-assisted first-round
                  screening.
                </span>
              </label>
              <button
                className="candidate-btn primary"
                disabled={permission !== "ready" || !consent || saving}
                onClick={() => void begin()}
              >
                {saving
                  ? "Starting…"
                  : interviewMode === "agent"
                    ? "Start agent interview"
                    : "Start guided interview"}
              </button>
            </>
          ) : interviewMode === "agent" && current ? (
            <VoiceBeam
              className="voice-interview-beam"
              stream={listening ? microphoneStream : null}
              level={agentSpeaking ? 0.72 : 0}
              processing={saving}
              active={agentSpeaking || listening || saving}
              colorVariant="sunset"
              theme="light"
              sensitivity={1.15}
              threshold={0.025}
              strength={0.9}
            >
              <div className="voice-interview-panel">
                <div
                  className={`voice-agent-orb ${agentSpeaking ? "live" : ""}`}
                >
                  <Bot />
                </div>
                <p className="candidate-kicker">
                  Question {current.sequence} · {current.category} ·{" "}
                  {current.difficulty}
                </p>
                <h2>{current.question}</h2>
                <button
                  type="button"
                  className="candidate-btn secondary"
                  onClick={() => speak(current.question)}
                  disabled={agentSpeaking}
                >
                  <Volume2 />
                  {agentSpeaking ? "Agent speaking…" : "Repeat question"}
                </button>
                <label className="voice-answer-field">
                  Your answer transcript
                  <textarea
                    rows={7}
                    maxLength={12000}
                    value={transcript}
                    onChange={(event) => setTranscript(event.target.value)}
                    placeholder="Press Start answering and speak naturally, or type your answer."
                  />
                </label>
                <div className="interview-actions">
                  <button
                    className={`candidate-btn ${listening ? "danger" : "secondary"}`}
                    onClick={toggleListening}
                    disabled={agentSpeaking}
                  >
                    {listening ? <MicOff /> : <Mic />}
                    {listening ? "Stop listening" : "Start answering"}
                  </button>
                  <button
                    className="candidate-btn primary"
                    disabled={!transcript.trim() || saving || agentSpeaking}
                    onClick={() => void submit()}
                  >
                    {saving ? "Evaluating…" : "Submit to agent"}
                  </button>
                </div>
              </div>
            </VoiceBeam>
          ) : current ? (
            <>
              <p className="candidate-kicker">
                Question {current.sequence} · {current.category} ·{" "}
                {current.difficulty}
              </p>
              <h2>{current.question}</h2>
              <label>
                Your answer transcript
                <textarea
                  rows={9}
                  maxLength={12000}
                  value={transcript}
                  onChange={(event) => setTranscript(event.target.value)}
                  placeholder="Speak using the microphone button or type your answer."
                />
              </label>
              <div className="interview-actions">
                <button
                  className={`candidate-btn ${listening ? "danger" : "secondary"}`}
                  onClick={toggleListening}
                >
                  {listening ? (
                    <>
                      <MicOff />
                      Stop listening
                    </>
                  ) : (
                    <>
                      <Mic />
                      Start listening
                    </>
                  )}
                </button>
                <button
                  className="candidate-btn primary"
                  disabled={!transcript.trim() || saving}
                  onClick={() => void submit()}
                >
                  {saving ? "Evaluating…" : "Submit answer"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>All available questions answered</h2>
              <p>
                Complete the interview to submit the structured result for human
                review.
              </p>
              <button
                className="candidate-btn primary"
                disabled={saving}
                onClick={() => void complete()}
              >
                {saving ? "Completing…" : "Complete interview"}
              </button>
            </>
          )}
        </main>
      </div>
    </section>
  );
}
