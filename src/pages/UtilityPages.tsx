import { FormEvent, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { contentRepository } from "../content/repository";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const results = term ? contentRepository.search(term) : [];
  function submit(e: FormEvent) {
    e.preventDefault();
    setTerm(query.trim());
  }
  return (
    <>
      <Seo
        title="Search | SENZOFT"
        description="Search SENZOFT services, industries, solutions, insights and careers."
        noIndex
      />
      <PageHero
        eyebrow="Search"
        title="Find the right starting point."
        description="Search across our technology services, industries and software solutions."
      />
      <section className="section">
        <div className="container-shell">
          <form onSubmit={submit} className="flex max-w-2xl gap-3">
            <input
              aria-label="Search site"
              autoFocus
              className="field"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
            />
            <button className="btn btn-primary">
              <SearchIcon size={18} /> Search
            </button>
          </form>
          {!term && (
            <div className="mt-10">
              <h2 className="text-xl font-bold">Popular starting points</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {["Cloud", "AI", "Engineering", "Security"].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setQuery(topic);
                      setTerm(topic);
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <p className="mt-5 text-brand-muted">
                Search by a business challenge, capability or industry. Try a
                shorter phrase if you do not find a match.
              </p>
            </div>
          )}
          {term && results.length === 0 && (
            <p className="mt-8 rounded-xl bg-brand-cream p-6">
              No matching content. Try a broader term such as cloud, data or
              engineering.
            </p>
          )}
          {term && (
            <p className="mt-8 text-sm font-bold text-brand-muted">
              {results.length} result{results.length === 1 ? "" : "s"} for “
              {term}”
            </p>
          )}
          <div className="mt-5 divide-y divide-black/10">
            {results.map((item) => (
              <Link
                className="block py-6"
                key={item.id}
                to={item.route}
              >
                <span className="micro-label">{item.type}</span>
                <h2 className="text-2xl font-bold hover:text-brand-orange">
                  {item.title}
                </h2>
                <p className="mt-2 text-brand-muted">{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
const legal: Record<
  string,
  { title: string; description: string; sections: Array<[string, string]> }
> = {
  privacy: {
    title: "Privacy policy",
    description:
      "How SENZOFT handles information submitted through this website.",
    sections: [
      [
        "Information we collect",
        "We collect information you choose to provide through enquiry and recruitment forms. Form details are submitted to our hosting provider for delivery to SENZOFT.",
      ],
      [
        "How information will be used",
        "Submitted details are used to respond to enquiries, evaluate expressions of career interest and protect the website.",
      ],
      [
        "Your choices",
        "You may contact SENZOFT to ask about your personal information. For enquiries about your information or to withdraw recruitment contact consent, email contact@senzoft.com.",
      ],
      [
        "Video playback",
        "Illustrative videos and their still images are served directly with this website. Playback does not require a third-party account.",
      ],
      [
        "What to include in an enquiry",
        "Share only the information needed to explain your request. Please do not include passwords, payment details, confidential client records or sensitive documents in the general enquiry form.",
      ],
    ],
  },
  terms: {
    title: "Terms of use",
    description: "Conditions for using the SENZOFT website.",
    sections: [
      [
        "Website content",
        "This website provides general information. Service information describes our capabilities and does not replace a written engagement agreement. Career discipline pages accept expressions of interest and do not promise an available vacancy.",
      ],
      [
        "Intellectual property",
        "SENZOFT names, marks and original website materials may not be reused without permission.",
      ],
      [
        "External links",
        "External resources may have their own terms and privacy practices.",
      ],
      [
        "Illustrative media",
        "Illustrative media supports the website's technology and collaboration themes. It does not identify SENZOFT employees, offices, clients or completed engagements.",
      ],
      [
        "Service scope",
        "Capability descriptions and example measures help frame a conversation. The scope, deliverables, responsibilities and commercial terms of an engagement are agreed separately.",
      ],
    ],
  },
  accessibility: {
    title: "Accessibility",
    description: "Our commitment to inclusive digital experiences.",
    sections: [
      [
        "Our approach",
        "We aim to meet WCAG 2.2 AA fundamentals through semantic structure, keyboard access, visible focus, sufficient contrast and reduced-motion support.",
      ],
      [
        "Feedback",
        "If you encounter an accessibility barrier, contact our team and describe the page and issue.",
      ],
      [
        "Ongoing improvement",
        "Accessibility is tested throughout design, engineering and content review.",
      ],
      [
        "Motion and video",
        "Decorative videos play a short introduction and then stop automatically. Automatic playback is disabled when your device requests reduced motion or data saving, and on small screens. Still images preserve the context when video is unavailable.",
      ],
      [
        "Keyboard navigation",
        "Use Tab to move between links, buttons and form controls. The Skip to content link appears when focused. Service and policy navigation links jump to the relevant section, and visible focus outlines help identify the current control.",
      ],
    ],
  },
};
export function LegalPage({ type }: { type: keyof typeof legal }) {
  const page = legal[type];
  return (
    <>
      <Seo title={`${page.title} | SENZOFT`} description={page.description} />
      <PageHero
        eyebrow="Legal & trust"
        title={page.title}
        description={page.description}
      />
      <article className="section">
        <div className="container-shell max-w-3xl">
          <nav aria-label="On this page" className="mb-10 flex flex-wrap gap-3">
            {page.sections.map(([heading], i) => (
              <a
                key={heading}
                className="rounded-full border border-black/15 px-4 py-2 text-sm font-bold"
                href={`#policy-${i}`}
              >
                {heading}
              </a>
            ))}
          </nav>
          {page.sections.map(([heading, text], i) => (
            <section id={`policy-${i}`} className="mb-10" key={heading}>
              <h2 className="text-2xl font-bold">{heading}</h2>
              <p className="mt-3 leading-8 text-brand-muted">{text}</p>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page not found | SENZOFT"
        description="The requested page could not be found."
        noIndex
      />
      <section className="grid min-h-[75vh] place-items-center bg-brand-ink px-4 pt-20 text-center text-white grid-lines">
        <div>
          <span className="text-8xl font-black gradient-text">404</span>
          <h1 className="display mt-5 text-5xl">
            This idea took a wrong turn.
          </h1>
          <p className="mt-5 text-white/60">
            The page may have moved or the address may be incomplete.
          </p>
          <Link to="/" className="btn btn-primary mt-8">
            Return home
          </Link>
          <div className="mt-6 flex justify-center gap-6 text-sm font-bold">
            <Link to="/services">Browse services</Link>
            <Link to="/search">Search the site</Link>
            <Link to="/contact">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
