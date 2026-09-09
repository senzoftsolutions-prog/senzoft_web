import { useEffect, useRef, useState } from "react";
import { useEffectsPaused } from "./MotionPreferences";
import { media, type MediaKey } from "../../content/media";

export function VideoPanel({
  clip = "digital",
  className = "",
}: {
  clip?: MediaKey;
  className?: string;
}) {
  const asset = media[clip];
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useEffectsPaused();
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const enable = () =>
      setAllowed(
        !connection?.saveData && !matchMedia("(max-width: 767px)").matches,
      );
    if (document.readyState === "complete") enable();
    else window.addEventListener("load", enable, { once: true });
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (container.current) observer.observe(container.current);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      window.removeEventListener("load", enable);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const shouldPlay =
    allowed && visible && pageVisible && !reduced && !finished && !failed;
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (!shouldPlay) {
      element.pause();
      return;
    }
    void element.play().catch(() => setFailed(true));
    // A short ambient introduction replaces looping footage and playback controls.
    const stop = window.setTimeout(() => {
      element.pause();
      setFinished(true);
    }, 4500);
    return () => {
      window.clearTimeout(stop);
      element.pause();
    };
  }, [shouldPlay]);
  return (
    <div ref={container} className={`video-panel ${className}`}>
      <img
        src={asset.poster}
        alt={asset.title}
        className="absolute inset-0 size-full object-cover"
        loading={clip === "digital" ? "eager" : "lazy"}
      />
      {!failed && (
        <video
          ref={video}
          src={allowed && visible && !reduced ? asset.src : undefined}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
          onTimeUpdate={(event) => {
            if (event.currentTarget.currentTime >= 4.5) {
              event.currentTarget.pause();
              setFinished(true);
            }
          }}
          onError={() => setFailed(true)}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
      <a
        href={asset.source}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-5 left-5 text-xs leading-5 text-white underline decoration-white/40 underline-offset-4"
      >
        Stock footage | {asset.credit}
      </a>
    </div>
  );
}
