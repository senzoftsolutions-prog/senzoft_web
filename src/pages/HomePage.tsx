import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CapabilityExplorer } from "../components/sections/CapabilityExplorer";
import { CTA } from "../components/sections/CTA";
import { Seo } from "../components/ui/Seo";
import { VideoPanel } from "../components/ui/VideoPanel";
import { insights } from "../content/insights";
import { businessOutcomes, featuredIndustries, technologyAreas, whySenzoft } from "../content/presentation";
import { Section } from "../components/ui/Section";
import { StatStrip } from "../components/sections/StatStrip";

const proofPrinciples = [
  ["Traceable decisions", "Architecture and delivery choices stay connected to business goals and constraints."],
  ["Reviewable increments", "Working progress, acceptance evidence and trade-offs remain visible throughout delivery."],
  ["Operational ownership", "Release, support and improvement responsibilities are defined before handover."],
] as const;

export default function HomePage() {
  return <>
    <Seo title="SENZOFT | Technology built around business outcomes" description="SENZOFT connects strategy, engineering, data, cloud and operations to create useful, lasting business change." />
    <section className="reference-hero"><div className="container-shell reference-hero-inner"><div className="reference-hero-content">
      <div className="reference-hero-copy"><span className="reference-kicker">Ideas to impact</span><h1>Technology that moves <span>business forward.</span></h1><p>We connect business context with engineering, data, cloud and operations to build useful change that lasts.</p><div className="reference-hero-actions"><Link to="/services" className="btn btn-dark">Explore services <ArrowUpRight size={17}/></Link><Link to="/contact" className="btn btn-outline light">Talk to our team <ArrowRight size={17}/></Link></div></div>
      <VideoPanel clip="digital" className="reference-home-video" />
    </div></div></section>

    <CapabilityExplorer />

    <Section tone="cream" eyebrow="Business outcomes" heading="Start with what needs to change." description="Technology earns its place when it improves a decision, experience or operation."><StatStrip items={businessOutcomes.map(([title, copy]) => ({ title, copy }))}/></Section>

    <section className="section bg-brand-ink text-white"><div className="container-shell"><div className="section-intro"><div><span className="eyebrow text-brand-amber!">Technology</span><h2 className="section-heading mt-5">The right capability for the work.</h2></div><p className="text-white/70">Explore technology as a business enabler, not a catalogue of tools.</p></div><div className="technology-area-grid mt-10">{technologyAreas.map((item, index) => <Link className="technology-area" to={`/technology/${item.slug}`} key={item.slug}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.summary}</p></div><ArrowUpRight size={18}/></Link>)}</div><Link className="read-link mt-8 text-white" to="/technology">Explore technology areas <ArrowRight size={17}/></Link></div></section>

    <section className="section industry-section"><div className="container-shell"><div className="section-intro"><div><span className="eyebrow">Industries</span><h2 className="section-heading mt-5">Context changes the answer.</h2></div><p>See how services connect to the users, regulations and operating realities of six priority sectors.</p></div><div className="industry-directory mt-9">{featuredIndustries.map((industry, index) => <Link key={industry.slug} to={`/industries/${industry.slug}`}><span className="text-xs text-brand-orange">{String(index + 1).padStart(2, "0")}</span><div><h3>{industry.title}</h3><p>{industry.summary}</p></div><ArrowUpRight size={21}/></Link>)}</div></div></section>

    <Section tone="sage" eyebrow="How confidence is built" heading="Evidence before claims."><StatStrip items={proofPrinciples.map(([title, copy]) => ({ title, copy }))}/></Section>

    <section className="section bg-brand-ink text-white"><div className="container-shell editorial-grid"><div><span className="eyebrow text-brand-amber!">Why SENZOFT</span><h2 className="section-heading mt-5">Clear thinking. Accountable delivery.</h2></div><div className="grid gap-4 sm:grid-cols-2">{whySenzoft.map((item) => <div className="flex items-center gap-3 border-b border-white/15 py-5" key={item}><CheckCircle2 className="text-brand-amber" size={19}/><strong>{item}</strong></div>)}</div></div></section>

    <section className="reference-insights"><div className="container-shell"><div className="reference-insights-header"><div><span className="eyebrow">Latest insights</span><h2>Useful thinking for the next decision.</h2></div><Link to="/insights" className="read-link">All insights <ArrowRight size={17}/></Link></div><div className="reference-card-grid">{insights.slice(0, 3).map((item) => <article className="reference-card" key={item.slug}><div className="reference-card-body"><span>{item.type}</span><h3>{item.title}</h3><p>{item.summary}</p><Link to={`/insights/${item.slug}`}>Read <ArrowUpRight size={16}/></Link></div></article>)}</div></div></section>
    <CTA />
  </>;
}
