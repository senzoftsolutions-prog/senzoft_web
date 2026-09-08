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
import { Reveal } from "../ui/Reveal";

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
interface GridItem {
  slug: string;
  title: string;
  summary: string;
  icon?: string;
  eyebrow?: string;
  status?: string;
}

export function ContentGrid({
  items,
  basePath,
}: {
  items: GridItem[];
  basePath: string;
}) {
  const layout =
    items.length === 2
      ? "mx-auto w-full max-w-4xl md:grid-cols-2"
      : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid items-stretch gap-5 ${layout}`}>
      {items.map((item, index) => {
        const Icon = icons[item.icon ?? "Code2"] ?? Code2;
        return (
          <Reveal className="h-full" key={item.slug} delay={index * 0.05}>
            <Link
              to={`${basePath}/${item.slug}`}
              className="card group flex h-full min-h-72 flex-col p-7"
            >
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
              {item.eyebrow && (
                <span className="mt-7 text-xs font-bold uppercase tracking-wider text-brand-orange">
                  {item.eyebrow}
                </span>
              )}
              <h3 className="display mt-3 text-3xl">{item.title}</h3>
              <p className="mt-4 grow leading-7 text-brand-muted">
                {item.summary}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold group-hover:text-brand-orange">
                Explore <ArrowUpRight size={17} />
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
