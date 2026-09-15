import { CheckCircle2 } from "lucide-react";
import { Reveal } from "../ui/Reveal";

type StatItem = { value: string; label: string } | { icon?: string; title: string; copy: string };
export function StatStrip({ items }: { items: StatItem[] }) {
  return <div className="outcome-strip mt-10">{items.map((item, index) => {
    const principle = "title" in item;
    return <Reveal className="h-full" delay={index * .05} key={principle ? item.title : item.label}><article className="card h-full p-7">
      {principle ? <><CheckCircle2 className="text-brand-orange"/><h3 className="display mt-5 text-2xl">{item.title}</h3><p className="mt-4 leading-7 text-brand-muted">{item.copy}</p></> : <><strong className="display text-4xl text-brand-orange">{item.value}</strong><p className="mt-3 text-brand-muted">{item.label}</p></>}
    </article></Reveal>;
  })}</div>;
}
