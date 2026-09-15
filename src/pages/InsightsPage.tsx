import { useMemo, useState } from "react";
import { ArrowUpRight, Clock3, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/ui/Reveal";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { insights } from "../content/insights";
import { FieldMedia } from "../components/sections/ContentGrid";

export default function InsightsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const types = ["All", ...new Set(insights.map((item) => item.type))];
  const filtered = useMemo(
    () => insights.filter((item) =>
      (type === "All" || item.type === type) &&
      `${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase()),
    ),
    [query, type],
  );
  return (
    <>
      <Seo title="Insights | SENZOFT" description="Practical perspectives on AI, modernization, cloud, digital experience and engineering quality." />
      <PageHero eyebrow="What we think" title="Ideas for making technology useful." description="Explore practical perspectives from the questions that shape strategy, engineering and responsible transformation." />
      <section className="section bg-brand-cream">
        <div className="container-shell editorial-grid">
          <div><span className="eyebrow">Featured perspective</span><h2 className="section-heading mt-5">{insights[0].title}</h2><p className="mt-5 leading-8 text-brand-muted">{insights[0].summary}</p><Link className="btn btn-dark mt-7" to={`/insights/${insights[0].slug}`}>Read featured insight <ArrowUpRight size={17}/></Link></div>
          <div className="rounded-3xl bg-brand-plum p-8 text-white md:p-12"><span className="micro-label text-brand-amber!">Knowledge hub</span><h3 className="display mt-8 text-4xl">Research the question before choosing the answer.</h3><p className="mt-5 leading-8 text-white/70">Perspectives connect strategy, industry context and delivery practice so readers can move from an idea to a useful next step.</p></div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="eyebrow accent">Latest thinking</span>
              <h2 className="display mt-5 max-w-3xl text-5xl md:text-6xl">A deeper feed for better decisions.</h2>
            </div>
            <p className="max-w-sm leading-7 text-brand-muted">Read the full perspective, follow the related capabilities and bring the useful questions into your next conversation.</p>
          </div>
          <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto]">
            <label className="field flex items-center gap-3"><Search size={18}/><span className="sr-only">Search insights</span><input className="w-full bg-transparent outline-none" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search insights"/></label>
            <div className="flex flex-wrap gap-2">{types.map((item)=><button key={item} onClick={()=>setType(item)} className={`btn ${type===item?"btn-dark":"btn-outline"}`}>{item}</button>)}</div>
          </div>
          <div className="insight-feed-grid">
            {filtered.map((insight, index) => (
              <Reveal key={insight.slug} delay={index * 0.06}>
                <Link to={`/insights/${insight.slug}`} className={`insight-feed-card insight-feed-card-${(index % 3) + 1} group`}><FieldMedia slug={insight.slug}/>
                  <div className="insight-feed-art" aria-hidden="true"><span>0{index + 1}</span></div>
                  <div className="p-7 md:p-8">
                    <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.14em] text-brand-orange">
                      <span>{insight.type}</span>
                      <span className="flex items-center gap-1.5 text-brand-muted normal-case tracking-normal"><Clock3 size={14} /> {insight.readTime}</span>
                    </div>
                    <h3 className="display mt-5 text-3xl">{insight.title}</h3>
                    <p className="mt-4 leading-7 text-brand-muted">{insight.summary}</p>
                    <span className="mt-7 inline-flex items-center gap-2 font-bold group-hover:text-brand-orange">Read perspective <ArrowUpRight size={17} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          {filtered.length === 0 && <p className="rounded-2xl bg-brand-cream p-8">No insights match those filters. Try a broader search.</p>}
        </div>
      </section>
      <section className="section bg-brand-plum text-white">
        <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div><span className="eyebrow text-brand-amber!">Keep exploring</span><h2 className="display mt-6 text-5xl md:text-6xl">Connect the idea to the work.</h2></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link className="feed-link-card" to="/services"><span>Capabilities</span><strong>Explore how we build and scale.</strong><ArrowUpRight size={18} /></Link>
            <Link className="feed-link-card" to="/industries"><span>Industries</span><strong>See technology grounded in context.</strong><ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
