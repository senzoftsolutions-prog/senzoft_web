import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CTA } from "../components/sections/CTA";
import { ContentGrid } from "../components/sections/ContentGrid";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { deliveryProcess, featuredIndustries, featuredServices, technologyAreas } from "../content/presentation";
import { Section } from "../components/ui/Section";
import { StatStrip } from "../components/sections/StatStrip";

const proofStandards = [
  ["Business context", "The intended outcome, constraints and ownership are made explicit."],
  ["Delivery evidence", "Working increments and acceptance signals support each decision."],
  ["Sustainable handover", "Operations, recovery and improvement paths are prepared before launch."],
] as const;

const Process = () => <section className="section bg-brand-cream"><div className="container-shell editorial-grid"><div><span className="eyebrow">How we work</span><h2 className="section-heading mt-5">One connected delivery process.</h2></div><div className="reference-listing-points">{deliveryProcess.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>;

const Technology = () => <section className="section bg-brand-ink text-white"><div className="container-shell"><span className="eyebrow text-brand-amber!">Technology</span><h2 className="section-heading mt-5">Capabilities selected around the outcome.</h2><div className="technology-area-grid mt-10">{technologyAreas.map((item, index) => <Link className="technology-area" to={`/technology/${item.slug}`} key={item.slug}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.summary}</p></div><ArrowUpRight size={18}/></Link>)}</div></div></section>;

const Industries = () => <section className="section"><div className="container-shell"><span className="eyebrow">Industries</span><h2 className="section-heading mt-5">Technology shaped by operating context.</h2><div className="industry-directory mt-10">{featuredIndustries.map((item, index) => <Link to={`/industries/${item.slug}`} key={item.slug}><span className="text-brand-orange">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.summary}</p></div><ArrowUpRight size={18}/></Link>)}</div></div></section>;

const Proof = () => <Section tone="sage" eyebrow="Delivery confidence" heading="Proof is built into the work."><StatStrip items={proofStandards.map(([title, copy]) => ({ title, copy }))}/></Section>;

export function ServicesPage() {
  return <><Seo title="Services | SENZOFT" description="Technology services built around business outcomes."/><PageHero eyebrow="Services" title="Technology services built around business outcomes." description="Choose the capability that best matches the change your organization needs to make." media="engineering"/>
    <section className="section"><div className="container-shell"><span className="eyebrow">Service expertise</span><h2 className="section-heading mt-5">A clear place to begin.</h2><div className="mt-10"><ContentGrid items={featuredServices} basePath="/services"/></div></div></section>
    <Process/><Technology/><Industries/><Proof/><CTA/>
  </>;
}

const challenges = [
  ["Fragmented journeys", "Customers and employees lose context across channels, teams and systems."],
  ["Complex information", "Data remains difficult to trust, govern and use at the moment of decision."],
  ["Legacy constraints", "Critical platforms resist change while operational risk continues to grow."],
  ["Security and resilience", "Regulation, identity and service continuity must evolve with the technology."],
] as const;

export function IndustriesPage() {
  return <><Seo title="Industries | SENZOFT" description="Technology grounded in your industry context."/><PageHero eyebrow="Industries" title="Technology grounded in how your world works." description="Explore six priority sectors and the connected services that address their users, regulations and operations." media="delivery"/>
    <section className="section"><div className="container-shell"><span className="eyebrow">Priority industries</span><h2 className="section-heading mt-5">Choose your context.</h2><div className="mt-10"><ContentGrid items={featuredIndustries} basePath="/industries"/></div></div></section>
    <section className="section bg-brand-cream"><div className="container-shell"><span className="eyebrow">Common challenges</span><h2 className="section-heading mt-5">Different sectors. Connected pressures.</h2><div className="outcome-strip mt-10">{challenges.map(([title, copy], index) => <article className="card p-7" key={title}><span className="micro-label">0{index + 1}</span><h3 className="display mt-5 text-2xl">{title}</h3><p className="mt-4 leading-7 text-brand-muted">{copy}</p></article>)}</div></div></section>
    <section className="section bg-brand-ink text-white"><div className="container-shell editorial-grid"><div><span className="eyebrow text-brand-amber!">How SENZOFT helps</span><h2 className="section-heading mt-5">Context first. Connected capability next.</h2></div><div className="grid gap-4 sm:grid-cols-2">{featuredServices.slice(0,4).map((service) => <Link className="flex items-center justify-between border-b border-white/15 py-5" to={`/services/${service.slug}`} key={service.slug}><strong>{service.title}</strong><ArrowUpRight size={18}/></Link>)}</div></div></section>
    <Proof/><CTA/>
  </>;
}
