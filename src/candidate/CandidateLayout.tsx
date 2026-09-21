import { useState } from "react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, BriefcaseBusiness, CalendarDays, FileCheck2, FileText, LayoutDashboard, LogOut, Menu, ShieldCheck, UserRound, UsersRound, X } from "lucide-react";
import { useCandidateAuth } from "./CandidateAuth";

const nav = [
  ["/candidate/dashboard", "Dashboard", LayoutDashboard], ["/candidate/profile", "My Profile", UserRound],
  ["/candidate/applications", "My Applications", BriefcaseBusiness], ["/candidate/interviews", "Interviews", CalendarDays],
  ["/candidate/documents", "Documents", FileText], ["/candidate/background-verification", "Background Verification", ShieldCheck],
  ["/candidate/offers", "Offers", FileCheck2], ["/candidate/joining", "Joining", UsersRound], ["/candidate/notifications", "Notifications", Bell],
] as const;

export function CandidateProtected() {
  const { user, loading } = useCandidateAuth();
  const location = useLocation();
  if (loading) return <div className="candidate-state" role="status">Checking your session…</div>;
  if (!user) return <Navigate to="/candidate/login" replace state={{ returnTo: location.pathname + location.search }} />;
  return <CandidateLayout />;
}

function CandidateLayout() {
  const { user, logout } = useCandidateAuth(); const navigate = useNavigate(); const [open, setOpen] = useState(false);
  return <div className="candidate-shell"><header className="candidate-topbar"><button className="candidate-icon mobile-only" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></button><NavLink className="candidate-brand" to="/candidate/dashboard"><span>S</span><strong>SENZOFT Careers</strong></NavLink><div className="candidate-user"><span>{user?.first_name || user?.email}</span><button className="candidate-icon" aria-label="Log out" onClick={() => { logout(); navigate("/candidate/login", { replace: true }); }}><LogOut /></button></div></header>{open && <button className="candidate-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}<aside className={`candidate-sidebar ${open ? "open" : ""}`}><div className="candidate-drawer-title"><strong>Candidate portal</strong><button className="candidate-icon" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button></div><nav>{nav.map(([to, text, Icon]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "active" : ""}><Icon /><span>{text}</span></NavLink>)}</nav><NavLink to="/careers/openings" className="browse-link">Browse open positions</NavLink></aside><main className="candidate-main"><Outlet /></main></div>;
}
