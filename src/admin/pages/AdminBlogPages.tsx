import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import {
  createAdminRecord,
  getAdminRecord,
  runAdminAction,
  updateAdminRecord,
} from "../../services/api/admin";
import { AdminState, ConfirmDialog, formatDate, StatusBadge } from "../AdminUI";
import { useAdminList, useDebouncedValue } from "../useAdminList";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  author_name?: string;
  published_at?: string | null;
  scheduled_at?: string | null;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  featured_image_metadata?: { url?: string; alt?: string };
};

export function AdminBlogPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const list = useAdminList<BlogPost>("blogs", { search: debouncedSearch, status, ordering: "-updated_at", page });
  const [error, setError] = useState("");
  const [pending, setPending] = useState<{ post: BlogPost; action: "publish" | "archive" } | null>(null);

  const confirmAction = async () => {
    if (!pending) return;
    try {
      await runAdminAction("blogs", pending.post.id, pending.action);
      setPending(null);
      await list.reload();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update the post.");
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">Content</p><h1>Blog</h1><p>Create, review, schedule, and publish articles.</p></div>
        <Link className="admin-btn admin-btn-primary" to="/admin/blog/new"><Plus size={16} /> New post</Link>
      </div>
      <div className="admin-toolbar">
        <label className="admin-search"><Search size={16} /><input aria-label="Search blog posts" placeholder="Search title, excerpt, or slug" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></label>
        <select aria-label="Filter by status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
          <option value="">All statuses</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="archived">Archived</option>
        </select>
      </div>
      {error && <div className="admin-form-error" role="alert">{error}</div>}
      <AdminState loading={list.loading} error={list.error} empty={!list.data.results.length} onRetry={list.reload}>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Post</th><th>Status</th><th>Author</th><th>Publish date</th><th>Actions</th></tr></thead><tbody>
          {list.data.results.map((post) => <tr key={post.id}>
            <td data-label="Post"><Link to={`/admin/blog/${post.id}`}><strong>{post.title}</strong></Link><small>/{post.slug}</small></td>
            <td data-label="Status"><StatusBadge value={post.status} /></td>
            <td data-label="Author">{post.author_name || "—"}</td>
            <td data-label="Publish date">{formatDate(post.published_at || post.scheduled_at)}</td>
            <td data-label="Actions" className="admin-row-actions"><Link to={`/admin/blog/${post.id}`}>Edit</Link>{post.status !== "PUBLISHED" && <button onClick={() => setPending({ post, action: "publish" })}>Publish</button>}{post.status !== "ARCHIVED" && <button className="danger" onClick={() => setPending({ post, action: "archive" })}>Archive</button>}</td>
          </tr>)}
        </tbody></table></div>
        <div className="admin-pagination"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page} · {list.data.count} records</span><button disabled={!list.data.next} onClick={() => setPage((value) => value + 1)}>Next</button></div>
      </AdminState>
      <ConfirmDialog open={Boolean(pending)} title={`${pending?.action === "publish" ? "Publish" : "Archive"} post?`} description={pending ? `This will ${pending.action} “${pending.post.title}”.` : ""} confirmLabel={pending?.action === "publish" ? "Publish" : "Archive"} destructive={pending?.action === "archive"} onClose={() => setPending(null)} onConfirm={confirmAction} />
    </section>
  );
}

export function AdminBlogFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", seo_title: "", seo_description: "", canonical_url: "", featured_image_url: "", featured_image_alt: "" });
  const [scheduleAt, setScheduleAt] = useState("");

  useEffect(() => {
    if (!id) return;
    getAdminRecord<BlogPost>("blogs", id).then((post) => {
      setForm({
        title: post.title || "", slug: post.slug || "", excerpt: post.excerpt || "", content: post.content || "",
        seo_title: post.seo_title || "", seo_description: post.seo_description || "", canonical_url: post.canonical_url || "",
        featured_image_url: post.featured_image_metadata?.url || "", featured_image_alt: post.featured_image_metadata?.alt || "",
      });
      if (post.scheduled_at) setScheduleAt(new Date(post.scheduled_at).toISOString().slice(0, 16));
    }).catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load post.")).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (!saving) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [saving]);

  const payload = () => ({
    title: form.title.trim(), slug: form.slug.trim(), excerpt: form.excerpt.trim(), content: form.content,
    seo_title: form.seo_title.trim(), seo_description: form.seo_description.trim(), canonical_url: form.canonical_url.trim(),
    featured_image_metadata: { url: form.featured_image_url.trim(), alt: form.featured_image_alt.trim() },
  });

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) { setError("Title, slug, and content are required."); return; }
    setSaving(true); setError("");
    try {
      if (id) await updateAdminRecord("blogs", id, payload()); else await createAdminRecord("blogs", payload());
      navigate("/admin/blog");
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to save post."); }
    finally { setSaving(false); }
  };

  const schedule = async () => {
    if (!id || !scheduleAt) { setError("Save the post first and choose a schedule date."); return; }
    const date = new Date(scheduleAt);
    if (Number.isNaN(date.getTime()) || date <= new Date()) { setError("Choose a future schedule date."); return; }
    setSaving(true); setError("");
    try {
      await updateAdminRecord("blogs", id, payload());
      await runAdminAction("blogs", id, "schedule", { published_at: date.toISOString() });
      navigate("/admin/blog");
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to schedule post."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="admin-state" role="status">Loading data…</div>;
  return <section className="admin-page admin-form-page">
    <div className="admin-page-heading"><div><p className="admin-eyebrow">Content</p><h1>{editing ? "Edit blog post" : "New blog post"}</h1><p>Write the article and configure its search and publishing metadata.</p></div></div>
    {error && <div className="admin-alert admin-alert-error" role="alert">{error}</div>}
    <form className="admin-form" onSubmit={save}>
      <div className="admin-card admin-form-grid">
        <label>Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
        <label>Slug<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} required /></label>
        <label className="admin-field-wide">Excerpt<textarea rows={3} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} /></label>
        <label className="admin-field-wide">Content<textarea rows={16} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} required /></label>
      </div>
      <div className="admin-card admin-form-grid"><h2 className="admin-field-wide">Featured image</h2>
        <label>Image URL<input type="url" value={form.featured_image_url} onChange={(event) => setForm({ ...form, featured_image_url: event.target.value })} /></label>
        <label>Alternative text<input value={form.featured_image_alt} onChange={(event) => setForm({ ...form, featured_image_alt: event.target.value })} /></label>
      </div>
      <div className="admin-card admin-form-grid"><h2 className="admin-field-wide">SEO</h2>
        <label>SEO title<input value={form.seo_title} maxLength={70} onChange={(event) => setForm({ ...form, seo_title: event.target.value })} /></label>
        <label>Canonical URL<input type="url" value={form.canonical_url} onChange={(event) => setForm({ ...form, canonical_url: event.target.value })} /></label>
        <label className="admin-field-wide">SEO description<textarea rows={3} maxLength={170} value={form.seo_description} onChange={(event) => setForm({ ...form, seo_description: event.target.value })} /></label>
      </div>
      {editing && <div className="admin-card admin-form-grid"><h2 className="admin-field-wide">Schedule</h2><label>Publish at<input type="datetime-local" value={scheduleAt} onChange={(event) => setScheduleAt(event.target.value)} /></label><div className="admin-form-action-field"><button type="button" className="admin-button admin-button-secondary" disabled={saving || !scheduleAt} onClick={() => void schedule()}>Schedule post</button></div></div>}
      <div className="admin-form-actions"><Link className="admin-btn admin-btn-secondary" to="/admin/blog">Cancel</Link><button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? "Saving…" : "Save post"}</button></div>
    </form>
  </section>;
}
