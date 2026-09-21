export const motionViewport = { once: true, margin: "-36px" } as const;
export const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
export const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
export const imageReveal = { hidden: { opacity: 0, scale: 1.015 }, visible: { opacity: 1, scale: 1 } };
export const mobileDrawer = { closed: { opacity: 0, x: "100%" }, open: { opacity: 1, x: 0 } };
export const transitionFor = (reduced: boolean, delay = 0) => ({ duration: reduced ? 0 : 0.48, delay: reduced ? 0 : Math.min(delay, .18), ease: [0.22, 1, 0.36, 1] as const });
