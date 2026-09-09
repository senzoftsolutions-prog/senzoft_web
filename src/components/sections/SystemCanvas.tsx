import { useState } from "react";
import {
  ArrowUpRight,
  Blocks,
  Check,
  Code2,
  Database,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useEffectsPaused } from "../ui/MotionPreferences";

const modes = [
  {
    name: "Build",
    label: "A connected product foundation",
    nodes: ["Experience", "Application", "Platform"],
    tags: ["Accessible interfaces", "Documented APIs", "Release confidence"],
    Icon: Code2,
  },
  {
    name: "Connect",
    label: "Information with a clear purpose",
    nodes: ["Sources", "Intelligence", "Workflow"],
    tags: ["Trusted data", "Human review", "Useful automation"],
    Icon: Database,
  },
  {
    name: "Evolve",
    label: "Ready for the next change",
    nodes: ["Observe", "Improve", "Release"],
    tags: ["Service visibility", "Focused changes", "Operational ownership"],
    Icon: Workflow,
  },
];
export function SystemCanvas() {
  const [selected, setSelected] = useState(0);
  const paused = useEffectsPaused();
  const mode = modes[selected];
  return (
    <div className={`system-canvas ${paused ? "effects-paused" : ""}`}>
      <div className="canvas-orbit orbit-one" aria-hidden="true" />
      <div className="canvas-orbit orbit-two" aria-hidden="true" />
      <div className="system-window">
        <div className="window-bar">
          <span className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>SENZOFT / engineering workspace</span>
          <Blocks size={14} />
        </div>
        <div className="window-body">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="micro-label">Architecture concept</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                Ideas, connected.
              </h2>
            </div>
            <span className="canvas-symbol">
              <mode.Icon size={23} />
            </span>
          </div>
          <div
            className="canvas-controls"
            role="group"
            aria-label="Explore the engineering model"
          >
            {modes.map((item, i) => (
              <button
                key={item.name}
                type="button"
                aria-pressed={i === selected}
                onClick={() => setSelected(i)}
              >
                {item.name}
                <ArrowUpRight size={12} />
              </button>
            ))}
          </div>
          <div className="pipeline" aria-hidden="true">
            {mode.nodes.map((node, i) => (
              <div key={node} className="pipeline-node">
                <span>
                  {i === 0 ? (
                    <Code2 size={20} />
                  ) : i === 1 ? (
                    <Sparkles size={20} />
                  ) : (
                    <Blocks size={20} />
                  )}
                </span>
                <strong>{node}</strong>
                <small>0{i + 1}</small>
              </div>
            ))}
          </div>
          <div className="pipeline-track" aria-hidden="true">
            <span />
          </div>
          <div className="canvas-detail" aria-live="polite">
            <p className="text-sm font-semibold">{mode.label}</p>
            <div className="mt-4 space-y-3">
              {mode.tags.map((tag) => (
                <p
                  key={tag}
                  className="flex items-center gap-2 text-xs text-brand-muted"
                >
                  <Check size={13} className="text-brand-orange" />
                  {tag}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="canvas-note note-top">
        <span className="note-icon">
          <ShieldCheck size={18} />
        </span>
        <div>
          <small>Trust, from the start</small>
          <strong>Quality by design</strong>
        </div>
      </div>
      <div className="canvas-note note-bottom">
        <span className="note-icon violet">
          <Workflow size={18} />
        </span>
        <div>
          <small>One connected journey</small>
          <strong>From idea to operation</strong>
        </div>
        <div className="signal-bars" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <i
              key={i}
              style={{ height: 8 + i * 4, animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
