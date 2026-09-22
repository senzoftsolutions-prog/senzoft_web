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
import AdminCookieManagementPage from "./pages/AdminCookieManagementPage";
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
  const roles = ["SUPER_ADMIN"];
  const gate = (element: ReactNode) => <RequireAdminRoles roles={roles}>{element}</RequireAdminRoles>;
  return <AdminAuthProvider><AdminMetadata /><Routes><Route path="login" element={<AdminLoginPage />} /><Route element={<ProtectedAdmin />}>
    <Route index element={<Navigate to="dashboard" replace />} /><Route path="dashboard" element={gate(<AdminDashboardPage />)} />
    <Route path="jobs" element={gate(<AdminJobsPage />)} /><Route path="jobs/new" element={gate(<AdminJobFormPage />)} /><Route path="jobs/:id" element={gate(<AdminJobFormPage />)} />
    <Route path="applications" element={gate(<AdminApplicationsPage />)} /><Route path="applications/:id" element={gate(<AdminApplicationDetailPage />)} />
    <Route path="candidates" element={gate(<AdminCandidatesPage />)} /><Route path="candidates/:id" element={gate(<AdminCandidateDetailPage />)} />
    <Route path="interviews" element={gate(<AdminResourceListPage resource="interviews" />)} /><Route path="interviews/:id" element={gate(<AdminResourceDetailPage resource="interviews" />)} />
    <Route path="documents" element={gate(<AdminResourceListPage resource="documents" />)} /><Route path="bgv" element={gate(<AdminResourceListPage resource="bgv" />)} /><Route path="bgv/:id" element={gate(<AdminResourceDetailPage resource="bgv" />)} />
    <Route path="offers" element={gate(<AdminResourceListPage resource="offers" />)} /><Route path="offers/:id" element={gate(<AdminResourceDetailPage resource="offers" />)} /><Route path="joining" element={gate(<AdminResourceListPage resource="joining" />)} />
    <Route path="blog" element={gate(<AdminBlogPage />)} /><Route path="blog/new" element={gate(<AdminBlogFormPage />)} /><Route path="blog/:id" element={gate(<AdminBlogFormPage />)} />
    <Route path="cookies" element={gate(<AdminCookieManagementPage />)} /><Route path="users" element={gate(<AdminUsersPage />)} /><Route path="audit-logs" element={gate(<AdminAuditPage />)} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Route></Routes></AdminAuthProvider>;
}
