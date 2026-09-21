import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useEffectsPaused } from "../ui/MotionPreferences";

const CTA_SLIDES = [
  { title: "Software Engineering", image: "/media/cta-software-engineering-v2.png", alt: "Experienced software engineers reviewing application architecture and code in a professional technology studio" },
  { title: "AI & Data", image: "/media/cta-ai-data-professionals.webp", alt: "Data specialists reviewing analytics and connected data workflows in a professional office" },
  { title: "Cloud & Infrastructure", image: "/media/cta-cloud-infrastructure.png", alt: "An abstract resilient cloud infrastructure architecture" },
] as const;
const SLIDE_DURATION = 2200;

export function CTA() {
  const reducedMotion = useEffectsPaused();
  const [activeSlide, setActiveSlide] = useState(0);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const selectSlide = useCallback((index: number) => setActiveSlide((index + CTA_SLIDES.length) % CTA_SLIDES.length), []);

  useEffect(() => {
    const image = new Image();
    image.src = CTA_SLIDES[(activeSlide + 1) % CTA_SLIDES.length].image;
  }, [activeSlide]);
  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reducedMotion || !visible) return;
    const timer = window.setTimeout(() => selectSlide(activeSlide + 1), SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [activeSlide, reducedMotion, selectSlide, visible]);

  return <section className="cta-section">
    <div ref={cardRef} className="container-shell cta-card cta-carousel text-white" onTouchStart={(event) => { const touch = event.touches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY }; }} onTouchEnd={(event) => {
      if (!touchStart.current) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x, dy = touch.clientY - touchStart.current.y;
      touchStart.current = null;
      if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.2) selectSlide(activeSlide + (dx < 0 ? 1 : -1));
    }}>
      <div className="cta-card-content">
        <span className="eyebrow">Have a technology challenge?</span>
        <h2 className="display">Let&apos;s build something<br/><span>that works for your<br/>business.</span></h2>
        <p>From strategy to scale, we turn technology into real business impact across every industry.</p>
        <div className="cta-actions"><Link to="/contact" className="btn cta-primary">Talk to our team <ArrowRight size={18}/></Link></div>
      </div>
      <div className="cta-visual" role="group" aria-roledescription="carousel" aria-label="SENZOFT capabilities">
        <div className="cta-slides" aria-live="polite">
          {CTA_SLIDES.map((slide, index) => <figure className={`cta-slide ${index === activeSlide ? "is-active" : ""}`} aria-hidden={index !== activeSlide} key={slide.title}><img src={slide.image} alt={index === activeSlide ? slide.alt : ""} width="960" height="720" loading={index === 0 ? "eager" : "lazy"} decoding="async" /></figure>)}
          <div className="cta-slide-label"><span>0{activeSlide + 1}</span><strong>{CTA_SLIDES[activeSlide].title}</strong></div>
        </div>
        <div className="cta-indicators" aria-label="Choose capability image">{CTA_SLIDES.map((slide, index) => <button type="button" aria-label={`Show ${slide.title}`} aria-current={index === activeSlide ? "true" : undefined} onClick={() => selectSlide(index)} key={slide.title}><span/><i /></button>)}</div>
      </div>
    </div>
  </section>;
}
