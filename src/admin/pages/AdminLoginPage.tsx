import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { PasswordField } from "../../components/ui/PasswordField";
import { useAdminAuth } from "../AdminAuth";

export default function AdminLoginPage() {
  const { user, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => { document.title = "Super Admin login | SENZOFT"; }, []);
  if (user) return <Navigate to="/admin/dashboard" replace />;
  const destination = (location.state as { from?: string } | null)?.from ?? "/admin/dashboard";

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result) throw new Error("Only the Super Admin account can access this portal.");
      navigate(destination, { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign-in failed. Please try again.");
    } finally { setLoading(false); }
  }

  return <main className="admin-login">
    <section className="admin-login-panel"><a href="/" className="admin-login-brand"><span>S</span> SENZOFT</a><div className="admin-login-copy"><span>Recruitment operations</span><h1>Work clearly.<br />Hire thoughtfully.</h1><p>One secure workspace for the SENZOFT Super Admin.</p></div></section>
    <section className="admin-login-form-wrap"><form className="admin-login-form" onSubmit={submit}><div className="admin-login-icon"><LockKeyhole /></div><p className="admin-kicker">Protected access</p><h2>Super Admin sign in</h2><p>Use the registered Super Admin email and password.</p><label>Email address <span aria-hidden="true">*</span><input type="email" autoFocus required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password <span aria-hidden="true">*</span><PasswordField required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="admin-form-error" role="alert">{error}</p>}<button className="admin-btn admin-btn-primary admin-login-submit" disabled={loading || !email.trim() || !password}>{loading ? "Signing in…" : <>Sign in <ArrowRight /></>}</button><a href="/" className="admin-back-link">Return to SENZOFT website</a></form></section>
  </main>;
}
