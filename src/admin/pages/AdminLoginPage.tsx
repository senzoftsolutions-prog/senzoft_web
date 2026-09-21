import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useAdminAuth } from "../AdminAuth";

export default function AdminLoginPage() {
  const { user, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => { document.title = "Admin login | SENZOFT"; }, []);
  if (user) return <Navigate to="/admin/dashboard" replace />;
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setLoading(true);
    try { await login(username.trim(), password); navigate((location.state as { from?: string } | null)?.from ?? "/admin/dashboard", { replace: true }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Login failed."); }
    finally { setLoading(false); }
  }
  return <main className="admin-login"><section className="admin-login-panel"><a href="/" className="admin-login-brand"><span>S</span> SENZOFT</a><div className="admin-login-copy"><span>Recruitment operations</span><h1>Work clearly.<br />Hire thoughtfully.</h1><p>A secure workspace for SENZOFT recruitment teams.</p></div></section><section className="admin-login-form-wrap"><form className="admin-login-form" onSubmit={submit}><div className="admin-login-icon"><LockKeyhole /></div><p className="admin-kicker">Protected access</p><h2>Sign in to Admin</h2><p>Use your authorized SENZOFT account.</p><label>Email or username <span aria-hidden="true">*</span><input autoFocus required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} /></label><label>Password <span aria-hidden="true">*</span><input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="admin-form-error" role="alert">{error}</p>}<button className="admin-btn admin-btn-primary admin-login-submit" disabled={loading || !username.trim() || !password}>{loading ? "Signing in…" : <>Sign in <ArrowRight /></>}</button><a href="/" className="admin-back-link">Return to SENZOFT website</a></form></section></main>;
}
