import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
import {
  getPublishedJob,
  getPublishedJobs,
  type ApiJob,
  type Paginated,
} from "../services/api/jobs";
import { tokenStore } from "../services/api/client";
import "../styles/candidate.css";

const show = (value: string) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
const date = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "—";

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
    if (filters.experience_level) api.set("experience_level", filters.experience_level);
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
  const apply = () => {
    const target = "/candidate/apply/" + jobId;
    if (!tokenStore.access()) {
      sessionStorage.setItem("candidate-return-to", target);
    }
  };
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
  const applyTo = tokenStore.access()
    ? "/candidate/apply/" + job.id
    : "/candidate/login";
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
      <Seo title={job.title} description={job.description.slice(0, 155)} />
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
