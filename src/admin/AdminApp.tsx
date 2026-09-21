import { useEffect, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminAuthProvider } from "./AdminAuth";
import { ProtectedAdmin, RequireAdminRoles } from "./AdminLayout";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminJobsPage from "./pages/AdminJobsPage";
import AdminJobFormPage from "./pages/AdminJobFormPage";
import AdminApplicationsPage from "./pages/AdminApplicationsPage";
import AdminApplicationDetailPage from "./pages/AdminApplicationDetailPage";
import AdminCandidatesPage from "./pages/AdminCandidatesPage";
import AdminCandidateDetailPage from "./pages/AdminCandidateDetailPage";
import { AdminResourceDetailPage, AdminResourceListPage } from "./pages/AdminResourcePages";
import { AdminBlogFormPage, AdminBlogPage } from "./pages/AdminBlogPages";
import { AdminAuditPage, AdminUsersPage } from "./pages/AdminUsersAuditPages";
import "../styles/admin.css";

function AdminMetadata() {
  useEffect(() => {
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.content = "noindex, nofollow";
  }, []);
  return null;
}

export default function AdminApp() {
  const recruitment = ["RECRUITER", "HIRING_MANAGER", "ADMIN", "SUPER_ADMIN"];
  const applications = ["RECRUITER", "HIRING_MANAGER", "HR", "ADMIN", "SUPER_ADMIN"];
  const people = ["RECRUITER", "HIRING_MANAGER", "INTERVIEWER", "HR", "ADMIN", "SUPER_ADMIN"];
  const hr = ["HR", "ADMIN", "SUPER_ADMIN"];
  const admins = ["ADMIN", "SUPER_ADMIN"];
  const gate = (roles: string[], element: ReactNode) => <RequireAdminRoles roles={roles}>{element}</RequireAdminRoles>;
  return <AdminAuthProvider><AdminMetadata /><Routes><Route path="login" element={<AdminLoginPage />} /><Route element={<ProtectedAdmin />}><Route index element={<Navigate to="dashboard" replace />} /><Route path="dashboard" element={<AdminDashboardPage />} /><Route path="jobs" element={gate(recruitment, <AdminJobsPage />)} /><Route path="jobs/new" element={gate(recruitment, <AdminJobFormPage />)} /><Route path="jobs/:id" element={gate(recruitment, <AdminJobFormPage />)} /><Route path="applications" element={gate(applications, <AdminApplicationsPage />)} /><Route path="applications/:id" element={gate(applications, <AdminApplicationDetailPage />)} /><Route path="candidates" element={gate(people, <AdminCandidatesPage />)} /><Route path="candidates/:id" element={gate(people, <AdminCandidateDetailPage />)} /><Route path="interviews" element={gate(people, <AdminResourceListPage resource="interviews" />)} /><Route path="interviews/:id" element={gate(people, <AdminResourceDetailPage resource="interviews" />)} /><Route path="documents" element={gate(hr, <AdminResourceListPage resource="documents" />)} /><Route path="bgv" element={gate(hr, <AdminResourceListPage resource="bgv" />)} /><Route path="bgv/:id" element={gate(hr, <AdminResourceDetailPage resource="bgv" />)} /><Route path="offers" element={gate(hr, <AdminResourceListPage resource="offers" />)} /><Route path="offers/:id" element={gate(hr, <AdminResourceDetailPage resource="offers" />)} /><Route path="joining" element={gate(hr, <AdminResourceListPage resource="joining" />)} /><Route path="blog" element={gate(admins, <AdminBlogPage />)} /><Route path="blog/new" element={gate(admins, <AdminBlogFormPage />)} /><Route path="blog/:id" element={gate(admins, <AdminBlogFormPage />)} /><Route path="users" element={gate(admins, <AdminUsersPage />)} /><Route path="audit-logs" element={gate(admins, <AdminAuditPage />)} /><Route path="*" element={<Navigate to="dashboard" replace />} /></Route></Routes></AdminAuthProvider>;
}
