import { useState, type ReactNode } from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, ChartNoAxesCombined, ClipboardList, Cookie, FileCheck2, FileText, LogOut, Menu, MessageSquareText, ShieldCheck, UserRoundCog, UsersRound, Video, X } from "lucide-react";
import { useAdminAuth } from "./AdminAuth";
import { PortalBrand } from "../components/ui/PortalBrand";

const navigation = [
  { to: "/admin/dashboard", label: "Dashboard", icon: ChartNoAxesCombined, roles: ["SUPER_ADMIN"] },
  { to: "/admin/jobs", label: "Jobs", icon: BriefcaseBusiness, roles: ["SUPER_ADMIN"] },
  { to: "/admin/candidates", label: "Candidates", icon: UsersRound, roles: ["SUPER_ADMIN"] },
  { to: "/admin/applications", label: "Applications", icon: ClipboardList, roles: ["SUPER_ADMIN"] },
  { to: "/admin/interviews", label: "Interviews", icon: Video, roles: ["SUPER_ADMIN"] },
  { to: "/admin/documents", label: "Documents", icon: FileText, roles: ["SUPER_ADMIN"] },
  { to: "/admin/bgv", label: "BGV", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
  { to: "/admin/offers", label: "Offers", icon: FileCheck2, roles: ["SUPER_ADMIN"] },
  { to: "/admin/joining", label: "Joining", icon: UsersRound, roles: ["SUPER_ADMIN"] },
  { to: "/admin/blog", label: "Blog", icon: MessageSquareText, roles: ["SUPER_ADMIN"] },
  { to: "/admin/cookies", label: "Cookies", icon: Cookie, roles: ["SUPER_ADMIN"] },
  { to: "/admin/users", label: "Users", icon: UserRoundCog, roles: ["SUPER_ADMIN"] },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
];

export function ProtectedAdmin() {
  const { user, loading } = useAdminAuth();
  if (loading) return <div className="admin-auth-loading" role="status">Checking your session…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
}

export function RequireAdminRoles({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { user } = useAdminAuth();
  if (!user || !roles.includes(user.role)) return <Navigate to="/admin/dashboard" replace />;
  return <>{children}</>;
}

function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const visible = navigation.filter((item) => item.roles.includes(user.role));
  return <div className="admin-shell">
    <header className="admin-topbar"><button className="admin-icon-btn admin-menu-toggle" onClick={() => setOpen(true)} aria-label="Open admin navigation"><Menu /></button><PortalBrand to="/admin/dashboard" label="SENZOFT Admin" /><div className="admin-user"><div><strong>{user.first_name || user.username}</strong><span>{user.role.replaceAll("_", " ")}</span></div><button className="admin-icon-btn" aria-label="Log out" onClick={() => { logout(); navigate("/admin/login", { replace: true }); }}><LogOut /></button></div></header>
    {open && <button className="admin-drawer-backdrop" aria-label="Close admin navigation" onClick={() => setOpen(false)} />}
    <aside className={`admin-sidebar ${open ? "is-open" : ""}`} aria-label="Admin navigation"><div className="admin-sidebar-mobile"><strong>Navigation</strong><button className="admin-icon-btn" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button></div><nav>{visible.map(({ to, label: itemLabel, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "active" : ""}><Icon /><span>{itemLabel}</span></NavLink>)}</nav></aside>
    <main className="admin-main" id="admin-main"><Outlet /></main>
  </div>;
}
