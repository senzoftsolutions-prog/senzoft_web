import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { type CareerJob } from "../../data/jobs";
import { testimonials } from "../../data/testimonials";

export function CareerIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: React.ReactNode }) {
  const reduced = useReducedMotion();
  return <section className="career-intro careers-hero"><div className="career-hero-ball tech-orb" aria-hidden="true" /><div className="container-shell relative z-10 py-24 md:py-32">
    <motion.span initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .3 }} className="eyebrow !text-orange-200">{eyebrow}</motion.span>
    <motion.h1 initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .32, delay: reduced ? 0 : .08 }} className="display mt-7 max-w-4xl text-[clamp(3.25rem,8vw,7rem)] text-white">{title}</motion.h1>
    <motion.p initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .32, delay: reduced ? 0 : .16 }} className="mt-7 max-w-2xl text-lg leading-8 text-slate-200">{description}</motion.p>
    {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
  </div></section>;
}

export function CareerHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="mb-10"><span className="eyebrow">{eyebrow}</span><h2 className="display mt-5 max-w-3xl text-4xl md:text-6xl">{title}</h2>{copy && <p className="mt-5 max-w-2xl text-brand-muted leading-7">{copy}</p>}</div>;
}

export function JobCard({ job, index = 0 }: { job: CareerJob; index?: number }) {
  const reduced = useReducedMotion();
  return <motion.article initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .32, delay: Math.min(index, 3) * .08 }} className="career-job-card group">
    <div className="flex items-start justify-between gap-3"><span className="career-pill">{job.department}</span><BriefcaseBusiness size={20} className="text-brand-orange" /></div>
    <h3 className="mt-7 text-2xl font-bold">{job.title}</h3><p className="mt-3 min-h-14 leading-7 text-brand-muted">{job.summary}</p>
    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-brand-muted"><span className="flex items-center gap-1"><MapPin size={15} />{job.location}</span><span>{job.type}</span><span>{job.experience}</span></div>
    <div className="mt-4 flex items-center gap-1 text-xs text-brand-muted"><CalendarDays size={14} /> Sample posted date: {new Date(`${job.postedDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
    <Link to={`/careers/openings/${job.id}`} className="mt-7 inline-flex items-center gap-2 font-bold text-brand-orange">View details <ArrowUpRight size={17} /></Link>
  </motion.article>;
}

export function StatsCounter({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!visible) return;
    if (reduced) { setValue(target); return; }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => { const progress = Math.min((now - start) / 350, 1); setValue(Math.round(target * (1 - (1 - progress) ** 3))); if (progress < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, target, reduced]);
  return <div ref={ref}><strong className="display block text-5xl md:text-6xl">{value}{suffix}</strong><span className="mt-3 block text-sm font-semibold text-slate-300">{label}</span></div>;
}

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => { if (paused || reduced) return; const timer = window.setInterval(() => setIndex((current) => (current + 1) % testimonials.length), 5000); return () => window.clearInterval(timer); }, [paused, reduced]);
  const item = testimonials[index];
  return <div className="career-quote" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)} onTouchStart={(event) => setTouchStart(event.touches[0].clientX)} onTouchEnd={(event) => { if (touchStart === null) return; const delta = event.changedTouches[0].clientX - touchStart; if (Math.abs(delta) > 40) setIndex((current) => (current + (delta < 0 ? 1 : testimonials.length - 1)) % testimonials.length); setTouchStart(null); }}>
    <span className="eyebrow">Illustrative quotes</span>
    <AnimatePresence mode="wait"><motion.div key={index} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0 }} transition={{ duration: .28 }} aria-live="polite"><blockquote className="display mt-8 text-3xl leading-tight md:text-5xl">“{item.quote}”</blockquote><p className="mt-7 font-bold">{item.name} <span className="font-normal text-brand-muted">· {item.role}</span></p></motion.div></AnimatePresence>
    <div className="mt-8 flex gap-2" aria-label="Choose quote">{testimonials.map((quote, itemIndex) => <button key={itemIndex} type="button" onClick={() => setIndex(itemIndex)} aria-label={`Show quote ${itemIndex + 1}`} aria-pressed={index === itemIndex} className={`h-2 rounded-full transition-all ${index === itemIndex ? "w-9 bg-brand-orange" : "w-2 bg-slate-300"}`} title={quote.role} />)}</div>
    <p className="mt-5 text-xs text-brand-muted">Sample text for layout review; employee quotes require approval.</p>
  </div>;
}

export function CareerCta() { return <section className="career-cta section text-white"><div className="container-shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><span className="eyebrow !text-orange-200">Your next step</span><h2 className="display mt-5 max-w-2xl text-4xl text-white md:text-6xl">Make room for what comes next.</h2></div><div className="flex flex-wrap gap-3"><Link className="btn btn-primary" to="/careers/openings">View all roles <ArrowRight size={17} /></Link><a className="btn btn-outline !border-white !text-white" href="mailto:careers@senzoft.com?subject=Talent%20Network%20Interest">Join our talent network</a></div></div></section>; }

export function SampleNotice() { return <p className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-brand-ink"><strong>Career experience preview:</strong> The roles and dates on these pages are illustrative samples, not confirmed vacancies. For real opportunities, contact SENZOFT directly.</p>; }
