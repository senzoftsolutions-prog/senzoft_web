import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
const MotionContext = createContext(false);
export function MotionPreferences({ children }: { children: ReactNode }) {
  const reduced = Boolean(useReducedMotion());
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
