import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, BriefcaseBusiness, CalendarDays, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { PortalBrand } from "../components/ui/PortalBrand";
import { useCandidateAuth } from "./CandidateAuth";

const tabs = [
  ["/candidate/dashboard", "Overview", LayoutDashboard],
  ["/candidate/applications", "Applications", BriefcaseBusiness],
  ["/candidate/events", "Events", CalendarDays],
  ["/candidate/profile", "Profile", UserRound],
] as const;

export function CandidateProtected() {
  const { user, loading } = useCandidateAuth();
  const location = useLocation();
  if (loading) return <div className="candidate-state" role="status">Checking your session…</div>;
  if (!user) return <Navigate to="/candidate/login" replace state={{ returnTo: location.pathname + location.search }} />;
  return <CandidateLayout />;
}

function CandidateLayout() {
  const { user, logout } = useCandidateAuth();
  const navigate = useNavigate();
  return <div className="candidate-shell candidate-portal-shell">
    <header className="candidate-topbar candidate-portal-topbar">
      <PortalBrand to="/candidate/dashboard" label="SENZOFT Careers" />
      <div className="candidate-user">
        <NavLink className="candidate-notification-link" to="/candidate/notifications" aria-label="Notifications"><Bell /></NavLink>
        <span>{user?.first_name || user?.email}</span>
        <button className="candidate-icon" aria-label="Sign out" onClick={() => { logout(); navigate("/candidate/login", { replace: true }); }}><LogOut /></button>
      </div>
    </header>
    <nav className="candidate-tabbar" aria-label="Candidate portal">
      {tabs.map(([to,text,Icon])=><NavLink key={to} to={to} className={({isActive})=>isActive?"active":""}><Icon/><span>{text}</span></NavLink>)}
    </nav>
    <main className="candidate-main candidate-portal-main"><Outlet /></main>
  </div>;
}
