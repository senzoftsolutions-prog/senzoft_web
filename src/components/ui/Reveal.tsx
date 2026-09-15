import { motion } from "framer-motion";
import { useEffectsPaused } from "./MotionPreferences";
import type { ReactNode } from "react";
import { fadeUp, motionViewport, transitionFor } from "../../animations/motion";
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useEffectsPaused();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : fadeUp.hidden}
      animate={reduced ? { opacity: 1, y: 0 } : undefined}
      whileInView={fadeUp.visible}
      viewport={motionViewport}
      transition={transitionFor(reduced, delay)}
    >
      {children}
    </motion.div>
  );
}
