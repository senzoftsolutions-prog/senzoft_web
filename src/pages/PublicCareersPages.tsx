import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  Search,
  Share2,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import { Seo } from "../components/ui/Seo";
import { absoluteUrl, SITE_NAME } from "../seo/seo";
import { tokenStore } from "../services/api/client";
import {
  getPublishedJob,
  submitPublicApplication,
  getPublishedJobs,
  type ApiJob,
  type Paginated,
} from "../services/api/jobs";
import "../styles/candidate.css";

const show = (value: string) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
const date = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "—";

const COUNTRY_CODES: Record<string, string> = {
  india: "IN", "united states": "US", usa: "US", canada: "CA", "united kingdom": "GB", uk: "GB",
  australia: "AU", singapore: "SG", germany: "DE", france: "FR", "united arab emirates": "AE",
};

function jobPostingStructuredData(job: ApiJob): Record<string, unknown> | undefined {
  const datePosted = job.published_at ? new Date(job.published_at) : null;
  if (!datePosted || Number.isNaN(datePosted.getTime())) return undefined;
  const locationParts = job.location.split(",").map((part) => part.trim()).filter(Boolean);
  const countryName = locationParts.at(-1)?.toLowerCase() || "";
  const countryCode = COUNTRY_CODES[countryName];
  const isRemote = job.work_mode === "REMOTE";
  if (!countryCode || (!isRemote && locationParts.length < 2)) return undefined;

  const safe = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const descriptionParts = [
    `<p>${safe(job.description)}</p>`,
    job.responsibilities.length ? `<p>Responsibilities</p><ul>${job.responsibilities.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>` : "",
    job.required_skills.length ? `<p>Required skills</p><ul>${job.required_skills.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>` : "",
    job.qualifications.length ? `<p>Qualifications</p><ul>${job.qualifications.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>` : "",
  ].filter(Boolean).join("");
  const employmentTypes: Record<string, string> = { CONTRACT: "CONTRACTOR", INTERNSHIP: "INTERN", INTERN: "INTERN" };
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: descriptionParts,
    datePosted: datePosted.toISOString(),
    employmentType: employmentTypes[job.employment_type] || job.employment_type,
    hiringOrganization: { "@type": "Organization", name: SITE_NAME, sameAs: "https://www.senzoft.com", logo: absoluteUrl("/favicon.png") },
    identifier: { "@type": "PropertyValue", name: SITE_NAME, value: job.id },
    url: absoluteUrl(`/careers/openings/${job.id}`),
    directApply: true,
  };
  if (job.application_deadline) schema.validThrough = `${job.application_deadline}T23:59:59+05:30`;
  if (isRemote) {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = { "@type": "Country", name: countryCode };
  } else {
    schema.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: locationParts.slice(0, -1).join(", "),
        addressCountry: countryCode,
      },
    };
  }
  return schema;
}


export function PublicJobOpeningsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = useMemo(() => new URLSearchParams(location.search), []);
  const [search, setSearch] = useState(initial.get("search") || "");
  const [filters, setFilters] = useState({
    location: initial.get("location") || "",
    experience_level: initial.get("experience") || "",
    ordering: initial.get("ordering") || "-published_at",
  });
  const [page, setPage] = useState(Number(initial.get("page")) || 1);
  const [data, setData] = useState<Paginated<ApiJob> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debounced, setDebounced] = useState(search);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(search), 350);
    return () => window.clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (debounced) params.set("search", debounced);
    if (filters.location) params.set("location", filters.location);
    if (filters.experience_level) params.set("experience", filters.experience_level);
    if (filters.ordering !== "-published_at") params.set("ordering", filters.ordering);
    if (page > 1) params.set("page", String(page));
    navigate({ search: params.toString() }, { replace: true });
    const api = new URLSearchParams();
    if (debounced) api.set("search", debounced);
    if (filters.location) api.set("location", filters.location);
    if (filters.experience_level) api.set("experience", filters.experience_level);
    api.set("ordering", filters.ordering);
    api.set("page", String(page));
    setLoading(true);
    setError("");
    getPublishedJobs(api.toString())
      .then(setData)
      .catch((reason) =>
        setError(
          reason instanceof Error ? reason.message : "Unable to load jobs.",
        ),
      )
      .finally(() => setLoading(false));
  }, [debounced, filters, page]);
  const setFilter = (key: keyof typeof filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };
  const hasFilters = Boolean(
    search || filters.location || filters.experience_level || filters.ordering !== "-published_at",
  );
  const clearFilters = () => {
    setSearch("");
    setFilters({ location: "", experience_level: "", ordering: "-published_at" });
    setPage(1);
  };
  return (
    <>
      <Seo
        title="Open Positions | SENZOFT Careers"
        description="Explore current published career opportunities at SENZOFT."
      />
      <header className="career-api-hero">
        <div className="container-shell career-api-hero-inner">
          <p>Careers at SENZOFT</p>
          <h1>Build what matters.</h1>
          <span>
            Explore open positions and find the next step in your career.
          </span>
        </div>
      </header>
      <main className="career-openings-main">
        <div className="container-shell">
          <section
            className={`career-job-filters ${filtersExpanded ? "is-expanded" : ""}`}
            aria-label="Filter open positions"
          >
            <div className="career-filter-heading">
              <div><div><strong>Find your opportunity</strong><span>Search open roles by title, skill, or keyword</span></div></div>
              <div className="career-filter-actions">
                {hasFilters && (
                  <button type="button" onClick={clearFilters}>
                    <X aria-hidden="true" /> Clear
                  </button>
                )}
                <button className="career-mobile-filter-toggle" type="button" aria-expanded={filtersExpanded} aria-controls="career-advanced-filters" onClick={() => setFiltersExpanded((value) => !value)}>
                  <SlidersHorizontal aria-hidden="true" /> Filters <ChevronDown aria-hidden="true" />
                </button>
              </div>
            </div>
            <label className="career-search">
              <span>Search</span>
              <div>
                <Search aria-hidden="true" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Job title, skill, or keyword"
                />
              </div>
            </label>
            <div className="career-filter-grid" id="career-advanced-filters">
              <label>
                <span>Location</span>
                <input value={filters.location} onChange={(e) => setFilter("location", e.target.value)} placeholder="Any location" />
              </label>
              <label>
                <span>Experience level</span>
                <input value={filters.experience_level} onChange={(e) => setFilter("experience_level", e.target.value)} placeholder="Any experience" />
              </label>
              <label>
                <span>Sort by</span>
                <select
                  value={filters.ordering}
                  onChange={(e) => setFilter("ordering", e.target.value)}
                >
                  <option value="-published_at">Newest first</option>
                  <option value="published_at">Oldest first</option>
                  <option value="title">Title A–Z</option>
                  <option value="application_deadline">
                    Application deadline
                  </option>
                </select>
              </label>
            </div>
          </section>
          <div className="career-results-heading">
            <div>
              <p>Available opportunities</p>
              <h2>Open positions</h2>
            </div>
            {!loading && data && (
              <span>
                {data.count} {data.count === 1 ? "role" : "roles"}
              </span>
            )}
          </div>
          {loading ? (
            <div className="career-api-state">Loading published jobs…</div>
          ) : error ? (
            <div className="career-api-state error">
              <p>{error}</p>
              <button onClick={() => setPage((value) => value)}>Retry</button>
            </div>
          ) : !data?.results.length ? (
            <div className="career-api-state">
              <h2>No matching positions</h2>
              <p>Adjust the filters or check again later.</p>
            </div>
          ) : (
            <>
              <div className="career-job-grid">
                {data.results.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <div className="career-pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </button>
                <span>Page {page}</span>
                <button disabled={!data.next} onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
function JobCard({ job }: { job: ApiJob }) {
  const experience = `${job.minimum_experience}–${job.maximum_experience ?? `${job.minimum_experience}+`} years`;
  return (
    <article className="career-api-job">
      <div className="career-job-card-main">
        <div className="career-job-card-id">
          <span>{job.id}</span>
          <em>Now hiring</em>
        </div>
        <h3>
          <Link to={`/careers/openings/${job.id}`}>{job.title}</Link>
        </h3>
        <p>{job.description}</p>
        <dl>
          <div>
            <dt>
              <Building2 />
              Department
            </dt>
            <dd>{job.department}</dd>
          </div>
          <div>
            <dt>
              <MapPin />
              Location
            </dt>
            <dd>{job.location}</dd>
          </div>
          <div>
            <dt>
              <BriefcaseBusiness />
              Work mode
            </dt>
            <dd>{show(job.work_mode)}</dd>
          </div>
          <div>
            <dt>
              <Clock3 />
              Experience
            </dt>
            <dd>{experience}</dd>
          </div>
          <div>
            <dt>
              <CalendarDays />
              Posted
            </dt>
            <dd>{date(job.published_at)}</dd>
          </div>
          <div>
            <dt>
              <CalendarDays />
              Deadline
            </dt>
            <dd>{date(job.application_deadline)}</dd>
          </div>
        </dl>
      </div>
      <div className="career-job-card-action">
        <span>Interested in this opportunity?</span>
        <Link to={`/careers/openings/${job.id}`}>
          View role <ArrowRight />
        </Link>
      </div>
    </article>
  );
}

export function PublicJobDetailPage() {
  const { jobId = "" } = useParams();
  const [job, setJob] = useState<ApiJob | null>(null);
  const [similar, setSimilar] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    getPublishedJob(jobId)
      .then(setJob)
      .catch((reason) =>
        setError(reason instanceof Error ? reason.message : "Job not found."),
      )
      .finally(() => setLoading(false));
  }, [jobId]);
  useEffect(() => {
    if (!job?.department) return;
    const query = new URLSearchParams({
      department: job.department,
      ordering: "-published_at",
    });
    getPublishedJobs(query.toString())
      .then((response) =>
        setSimilar(
          response.results.filter((item) => item.id !== job.id).slice(0, 3),
        ),
      )
      .catch(() => setSimilar([]));
  }, [job]);
  const share = async () => {
    const details = {
      title: job?.title || "SENZOFT career opportunity",
      text: job?.description || "",
      url: window.location.href,
    };
    if (navigator.share) await navigator.share(details);
    else await navigator.clipboard.writeText(window.location.href);
  };
  if (loading) return <div className="career-api-state">Loading role…</div>;
  if (error || !job)
    return (
      <div className="career-api-state error">
        <h1>Position unavailable</h1>
        <p>{error}</p>
        <Link to="/careers/openings">View open positions</Link>
      </div>
    );
  const applyTo = job.source === "HRMS" ? "/careers/apply/" + job.id : tokenStore.access() ? "/candidate/apply/" + job.id : "/candidate/login";
  const apply = () => { if (job.source !== "HRMS" && !tokenStore.access()) sessionStorage.setItem("candidate-return-to", "/candidate/apply/" + job.id); };
  const locations = [job.location, ...job.additional_locations];
  const experience =
    job.minimum_experience +
    "–" +
    (job.maximum_experience ?? job.minimum_experience + "+") +
    " years";
  const companyCopy =
    job.about_company ||
    "SENZOFT builds practical digital solutions that help organizations modernize operations, use data effectively, and deliver better experiences. Our teams work across software engineering, cloud, data, automation, and applied AI with a focus on responsible, measurable outcomes.";
  return (
    <>
      <Seo title={`${job.title} | SENZOFT Careers`} description={job.description.slice(0, 155)} structuredData={jobPostingStructuredData(job)} />
      <header className="career-api-detail-hero">
        <div className="container-shell career-detail-hero-inner">
          <div className="career-detail-toolbar">
            <Link to="/careers/openings">
              <ArrowLeft />
              All positions
            </Link>
            <button type="button" onClick={() => void share()}>
              <Share2 />
              Share role
            </button>
          </div>
          <p className="career-detail-eyebrow">
            {job.department} · {job.id}
          </p>
          <h1>{job.title}</h1>
          <div className="career-detail-primary-meta">
            <span>
              <MapPin />
              {locations.join(" · ")}
            </span>
            <span>
              <BriefcaseBusiness />
              {show(job.work_mode)} · {show(job.employment_type)}
            </span>
            <span>
              <Clock3 />
              {experience}
            </span>
          </div>
          <div className="career-detail-hero-actions">
            <Link className="career-detail-apply" onClick={apply} to={applyTo}>
              Apply now <ArrowRight />
            </Link>
            <span>
              <Clock3 />
              Applications are reviewed as they arrive
            </span>
          </div>
        </div>
      </header>
      <main className="career-detail-main">
        <div className="container-shell career-detail-layout">
          <article className="career-detail-content">
            <JobSection
              eyebrow="The opportunity"
              title="Job overview"
              text={job.description}
            />
            <JobList
              eyebrow="Your impact"
              title="What you will do"
              items={job.responsibilities}
            />
            <JobList
              eyebrow="What you bring"
              title="Required capabilities"
              items={job.required_skills}
            />
            <JobList
              eyebrow="Additional strengths"
              title="We value"
              items={job.preferred_skills}
            />
            <JobList title="Qualifications" items={job.qualifications} />
            <JobList title="Benefits" items={job.benefits} />
            <JobSection
              eyebrow="Our company"
              title="About SENZOFT"
              text={companyCopy}
            />
            <section className="career-detail-apply-band">
              <div>
                <span>Ready to take the next step?</span>
                <h2>Build your next chapter with SENZOFT.</h2>
              </div>
              <Link onClick={apply} to={applyTo}>
                Apply for this role <ArrowRight />
              </Link>
            </section>
          </article>
          <aside className="career-application-info">
            <div className="career-glance-heading"><p>Role snapshot</p><h2>At a glance</h2><span>Everything you need before applying.</span></div>
            <div className="career-glance-primary">
              <JobFact icon={<MapPin />} label="Location" value={locations.join(" · ")} />
              <JobFact icon={<Clock3 />} label="Experience" value={experience} />
              <JobFact icon={<BriefcaseBusiness />} label="Schedule" value={show(job.employment_type)} />
            </div>
            <dl className="career-glance-secondary">
              <JobFact icon={<Building2 />} label="Job ID" value={job.id} />
              <JobFact icon={<BriefcaseBusiness />} label="Category" value={job.department} />
              {job.business_unit && (
                <JobFact
                  icon={<Building2 />}
                  label="Business unit"
                  value={job.business_unit}
                />
              )}
              <JobFact
                icon={<MapPin />}
                label="Work arrangement"
                value={show(job.work_mode)}
              />
              {job.reporting_to && (
                <JobFact
                  icon={<UsersRound />}
                  label="Reports to"
                  value={job.reporting_to}
                />
              )}
              {job.travel_requirement && (
                <JobFact
                  icon={<BriefcaseBusiness />}
                  label="Travel"
                  value={job.travel_requirement}
                />
              )}
              {job.hiring_eligibility && (
                <JobFact
                  icon={<UsersRound />}
                  label="Hiring eligibility"
                  value={job.hiring_eligibility}
                />
              )}
              {job.relocation_assistance && (
                <JobFact
                  icon={<MapPin />}
                  label="Relocation"
                  value={job.relocation_assistance}
                />
              )}
              <JobFact
                icon={<CalendarDays />}
                label="Published"
                value={date(job.published_at)}
              />
              <JobFact
                icon={<CalendarDays />}
                label="Apply by"
                value={date(job.application_deadline)}
              />
              <JobFact
                icon={<UsersRound />}
                label="Openings"
                value={String(job.number_of_openings)}
              />
            </dl>
            <div className="career-glance-footer"><span>Ready to apply?</span><Link onClick={apply} to={applyTo}>
              Apply for this role <ArrowRight />
            </Link></div>
          </aside>
        </div>
        {similar.length > 0 && (
          <section className="container-shell career-similar-jobs">
            <div className="career-results-heading">
              <div>
                <p>More opportunities</p>
                <h2>Similar roles</h2>
              </div>
            </div>
            <div>
              {similar.map((item) => (
                <JobCard key={item.id} job={item} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
function JobFact({
  icon,
  label,
  value,
  featured,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div className={featured ? "is-featured" : undefined}>
      <span>{icon}</span>
      <div>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    </div>
  );
}
function JobSection({
  title,
  text,
  eyebrow,
}: {
  title: string;
  text: string;
  eyebrow?: string;
}) {
  return (
    <section className="career-job-section">
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  );
}
function JobList({
  title,
  items,
  eyebrow,
}: {
  title: string;
  items: string[];
  eyebrow?: string;
}) {
  if (!items.length) return null;
  return (
    <section className="career-job-section">
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}


export function PublicJobApplyPage() {
  const { jobId = "" } = useParams();
  const [job, setJob] = useState<ApiJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [applicationId, setApplicationId] = useState("");
  useEffect(() => {
    getPublishedJob(jobId).then(setJob)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Position unavailable."))
      .finally(() => setLoading(false));
  }, [jobId]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const values = new FormData(event.currentTarget);
    setSaving(true); setError("");
    try {
      const result = await submitPublicApplication({
        job_id: jobId,
        candidate_name: String(values.get("candidate_name") || ""),
        candidate_email: String(values.get("candidate_email") || ""),
        candidate_phone: String(values.get("candidate_phone") || ""),
        cover_letter: String(values.get("cover_letter") || ""),
        linkedin_url: String(values.get("linkedin_url") || ""),
        portfolio_url: String(values.get("portfolio_url") || ""),
        current_role: String(values.get("current_role") || ""),
        current_company: String(values.get("current_company") || ""),
        resume_url: String(values.get("resume_url") || ""),
        website: String(values.get("website") || ""),
      });
      setApplicationId(result.id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Your application could not be submitted.");
    } finally { setSaving(false); }
  };
  if (loading) return <div className="career-api-state">Loading position?</div>;
  if (!job) return <div className="career-api-state error"><h1>Position unavailable</h1><p>{error || "This job is no longer accepting applications."}</p><Link to="/careers/openings">View open positions</Link></div>;
  if (job.source !== "HRMS") {
    const destination = tokenStore.access() ? `/candidate/apply/${job.id}` : "/candidate/login";
    if (!tokenStore.access()) sessionStorage.setItem("candidate-return-to", `/candidate/apply/${job.id}`);
    return <Navigate to={destination} replace />;
  }
  return <main className="career-detail-main"><div className="container-shell max-w-3xl py-12"><Seo title={`Apply: ${job.title} | SENZOFT Careers`} description={`Apply for ${job.title} at SENZOFT.`} />
    <Link to={`/careers/openings/${job.id}`} className="inline-flex items-center gap-2"><ArrowLeft /> Back to job</Link>
    <h1 className="mt-8 text-4xl font-bold">Apply for {job.title}</h1><p className="mt-3 text-brand-muted">Your application will be recorded in SENZOFT HRMS.</p>
    {applicationId ? <section className="career-api-state mt-8"><h2>Application submitted</h2><p>Your application reference is {applicationId}. The recruitment team will contact you by email.</p><Link to="/careers/openings">Browse other positions</Link></section> : <form onSubmit={(event) => void submit(event)} className="career-info-card mt-8 grid gap-5">
      <label className="font-bold">Full name<input name="candidate_name" required minLength={2} maxLength={200} autoComplete="name" className="field mt-2 w-full" /></label>
      <div className="grid gap-5 sm:grid-cols-2"><label className="font-bold">Email<input name="candidate_email" required type="email" maxLength={254} autoComplete="email" className="field mt-2 w-full" /></label><label className="font-bold">Phone<input name="candidate_phone" type="tel" maxLength={32} autoComplete="tel" className="field mt-2 w-full" /></label></div>
      <div className="grid gap-5 sm:grid-cols-2"><label className="font-bold">Current role<input name="current_role" maxLength={200} className="field mt-2 w-full" /></label><label className="font-bold">Current company<input name="current_company" maxLength={200} className="field mt-2 w-full" /></label></div>
      <label className="font-bold">LinkedIn profile<input name="linkedin_url" type="url" maxLength={500} className="field mt-2 w-full" /></label>
      <label className="font-bold">Portfolio or website<input name="portfolio_url" type="url" maxLength={500} className="field mt-2 w-full" /></label>
      <label className="font-bold">Resume or CV (optional)<input name="resume_file" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="field mt-2 w-full" /><span className="mt-2 block text-xs font-normal text-brand-muted">PDF or Word document, up to 10 MB. You can also provide an accessible link below.</span></label>
      <label className="font-bold">Resume link (optional)<input name="resume_url" type="url" maxLength={500} className="field mt-2 w-full" placeholder="https://..." /></label>
      <label className="font-bold">Cover note<textarea name="cover_letter" rows={5} maxLength={5000} className="field mt-2 w-full" /></label>
      <label className="hidden" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <button type="submit" disabled={saving} className="btn btn-primary justify-self-start">{saving ? "Submitting?" : "Submit application"} <ArrowRight size={17} /></button>
    </form>}
  </div></main>;
}
