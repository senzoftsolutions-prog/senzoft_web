import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const getSnapshot = () => window.matchMedia(motionQuery).matches;
const getServerSnapshot = () => false;
const MotionContext = createContext(false);
export function MotionPreferences({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    document.documentElement.dataset.effects = reduced ? "paused" : "playing";
    return () => {
      delete document.documentElement.dataset.effects;
    };
  }, [reduced]);
  return (
    <MotionContext.Provider value={reduced}>{children}</MotionContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useEffectsPaused() {
  return useContext(MotionContext);
}
