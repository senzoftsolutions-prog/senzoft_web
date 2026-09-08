import { ArrowUpRight, BrainCircuit, ChartNoAxesCombined, CloudCog, Code2, Factory, HeartPulse, Landmark, PanelsTopLeft, ShoppingBag, Workflow } from 'lucide-react'
import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../ui/Reveal'

const icons: Record<string, ComponentType<{size?:number}>> = { BrainCircuit, ChartNoAxesCombined, CloudCog, Code2, Factory, HeartPulse, Landmark, PanelsTopLeft, ShoppingBag, Workflow }
export function ContentGrid({ items, basePath }: { items: Array<{slug:string;title:string;summary:string;icon?:string;eyebrow?:string;status?:string}>; basePath:string }) {
 return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map((item,index)=>{const Icon=icons[item.icon??'Code2']??Code2;return <Reveal key={item.slug} delay={index*.05}><Link to={`${basePath}/${item.slug}`} className="card group flex min-h-72 flex-col p-7"><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-xl bg-brand-cream text-brand-orange"><Icon size={23}/></span>{item.status==='draft'&&<span className="rounded-full bg-brand-cream px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-muted">Preview</span>}</div>{item.eyebrow&&<span className="mt-7 text-xs font-bold uppercase tracking-wider text-brand-orange">{item.eyebrow}</span>}<h3 className="display mt-3 text-3xl">{item.title}</h3><p className="mt-4 grow leading-7 text-brand-muted">{item.summary}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold group-hover:text-brand-orange">Explore <ArrowUpRight size={17}/></span></Link></Reveal>})}</div>
}
