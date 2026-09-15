import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export function ScrollOrb() {
  const orb = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: orb,
    offset: ["start end", "end start"],
  });
  const rotation = useSpring(useTransform(scrollYProgress, [0, 1], [-35, 325]), {
    stiffness: 95,
    damping: 24,
    mass: 0.35,
  });
  const travel = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], ["-7%", "3%", "10%"]), {
    stiffness: 95,
    damping: 24,
    mass: 0.35,
  });

  return (
    <motion.div
      ref={orb}
      className="visual-orb"
      style={reduceMotion ? undefined : { rotate: rotation, x: travel }}
    />
  );
}
