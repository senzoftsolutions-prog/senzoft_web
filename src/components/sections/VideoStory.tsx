import { ArrowUpRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";

const videoUrl =
  "https://videos.pexels.com/video-files/3129977/3129977-hd_1920_1080_25fps.mp4";

export function VideoStory() {
  return (
    <section className="section bg-brand-cream">
      <div className="container-shell">
        <Reveal>
          <div className="relative min-h-[38rem] overflow-hidden rounded-[2rem] bg-brand-wine text-white shadow-2xl">
            <video
              className="absolute inset-0 size-full object-cover opacity-55"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Abstract orange digital information moving across a technology grid"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-wine/95 via-brand-wine/65 to-transparent" />
            <div className="grid-lines absolute inset-0" />
            <div className="relative flex min-h-[38rem] max-w-3xl flex-col justify-between p-8 md:p-14">
              <span className="grid size-14 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur">
                <Play size={22} fill="currentColor" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[.25em] text-brand-amber">
                  Technology in motion
                </p>
                <h2 className="display mt-5 text-5xl md:text-7xl">
                  Build the digital foundation for what comes next.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
                  Connect modern software, cloud, data, AI and security into a
                  technology core designed to learn and evolve.
                </p>
                <Link
                  to="/services"
                  className="mt-8 inline-flex items-center gap-2 font-extrabold"
                >
                  Explore our capabilities <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mt-3 text-right text-xs text-brand-muted">
          Video: Pressmaster via Pexels
        </p>
      </div>
    </section>
  );
}
