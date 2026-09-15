import {
  ArrowUpRight,
  Blocks,
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  CloudCog,
  Code2,
  DatabaseZap,
  Factory,
  GraduationCap,
  Headphones,
  HeartPulse,
  Landmark,
  Cpu,
  RadioTower,
  ShieldCheck,
  ShoppingBag,
  TestTube2,
} from "lucide-react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import pexelsImages from "../../content/pexels-images.json";

type FieldImage = { src: string; srcSet: string; alt: string };
const visuals = pexelsImages as Record<string, FieldImage>;
export function FieldMedia({ slug }: { slug: string }) {
  const visual = visuals[slug];
  if (!visual) return null;
  return <div className="content-card-media"><img src={visual.src} alt={visual.alt} loading="lazy" decoding="async"/></div>;
}

const icons: Record<string, ComponentType<{ size?: number }>> = {
  Blocks,
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  CloudCog,
  Code2,
  DatabaseZap,
  Factory,
  GraduationCap,
  Headphones,
  HeartPulse,
  Landmark,
  Cpu,
  RadioTower,
  ShieldCheck,
  ShoppingBag,
  TestTube2,
};
export interface ContentGridItem {
  slug: string;
  title: string;
  summary: string;
  icon?: string;
  eyebrow?: string;
  status?: string;
  href?: string;
  label?: string;
  image?: string;
}

export function ContentGrid({
  items,
  basePath,
}: {
  items: ContentGridItem[];
  basePath: string;
}) {
  const layout =
    items.length >= 3
      ? "md:grid-cols-2 lg:grid-cols-3"
      : items.length === 2
        ? "mx-auto w-full max-w-4xl md:grid-cols-2"
        : "mx-auto w-full max-w-md";
  if (!items.length) return null;
  return (
    <div className={`grid items-stretch gap-5 ${layout}`}>
      {items.map((item) => {
        const Icon = icons[item.icon ?? "Code2"] ?? Code2;
        return (
          <div className="h-full" key={item.slug}>
            <Link
              to={item.href ?? `${basePath}/${item.slug}`}
              className="card content-card group flex h-full min-h-64 flex-col p-7"
              onPointerMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty(
                  "--spot-x",
                  `${event.clientX - rect.left}px`,
                );
                event.currentTarget.style.setProperty(
                  "--spot-y",
                  `${event.clientY - rect.top}px`,
                );
              }}
            >
              <FieldMedia slug={item.slug}/>
              {item.image && !visuals[item.slug] && (
                <div className="offering-card-media">
                  <img
                    src={item.image}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.src = "/media/digital-work.jpg";
                    }}
                  />
                </div>
              )}
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-xl bg-brand-cream text-brand-orange">
                  <Icon size={23} />
                </span>
                {item.status === "draft" && (
                  <span className="rounded-full bg-brand-cream px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-muted">
                    Preview
                  </span>
                )}
              </div>
              {(item.eyebrow || item.label) && (
                <span className="mt-7 text-xs font-bold uppercase tracking-wider text-brand-orange">
                  {item.eyebrow ?? item.label}
                </span>
              )}
              <h3 className="display mt-3 text-2xl">{item.title}</h3>
              <p className="mt-4 grow leading-7 text-brand-muted">
                {item.summary}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold group-hover:text-brand-orange">
                Explore <ArrowUpRight size={17} />
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
