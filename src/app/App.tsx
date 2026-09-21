import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { LegalPage, NotFoundPage, SearchPage } from "../pages/UtilityPages";

const ServicesPage = lazy(() =>
  import("../pages/ListingPages").then((module) => ({
    default: module.ServicesPage,
  })),
);
const IndustriesPage = lazy(() =>
  import("../pages/ListingPages").then((module) => ({
    default: module.IndustriesPage,
  })),
);
const AboutPage = lazy(() => import("../pages/AboutPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const DetailPage = lazy(() => import("../pages/DetailPage"));
const SolutionPage = lazy(() => import("../pages/SolutionPage"));
const CareersPage = lazy(() => import("../pages/CareersPage"));
const CareerLifePage = lazy(() => import("../pages/CareerRoutes").then((module) => ({ default: module.CareerLifePage })));
const CareerBenefitsPage = lazy(() => import("../pages/CareerRoutes").then((module) => ({ default: module.CareerBenefitsPage })));
const LegacyCareerRedirect = lazy(() => import("../pages/CareerRoutes").then((module) => ({ default: module.LegacyCareerRedirect })));
const CareerPathPage = lazy(() => import("../pages/CareerPathPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const InsightsPage = lazy(() => import("../pages/InsightsPage"));
const InsightDetailPage = lazy(() => import("../pages/InsightDetailPage"));
const TechnologyPage = lazy(() => import("../pages/PlatformPages").then(m => ({ default: m.TechnologyPage })));
const TechnologyDetailPage = lazy(() => import("../pages/PlatformPages").then(m => ({ default: m.TechnologyDetailPage })));
const CaseStudiesPage = lazy(() => import("../pages/PlatformPages").then(m => ({ default: m.CaseStudiesPage })));
const CaseStudyDetailPage = lazy(() => import("../pages/PlatformPages").then(m => ({ default: m.CaseStudyDetailPage })));
const AdminApp = lazy(() => import("../admin/AdminApp"));
const CandidateApp = lazy(() => import("../candidate/CandidateApp"));
const PublicJobOpeningsPage = lazy(() => import("../pages/PublicCareersPages").then(module => ({ default: module.PublicJobOpeningsPage })));
const PublicJobDetailPage = lazy(() => import("../pages/PublicCareersPages").then(module => ({ default: module.PublicJobDetailPage })));
function Loading() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const delay = window.setTimeout(() => setShow(true), 700);
    return () => window.clearTimeout(delay);
  }, []);

  if (!show) return null;

  return (
    <div className="grid min-h-screen place-items-center" role="status" aria-label="Loading page">
      <span className="size-10 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="admin/*" element={<AdminApp />} />
        <Route path="candidate/*" element={<CandidateApp />} />
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/web-development" element={<Navigate to="/solutions/web-development" replace />} />
          <Route path="services/mobile-app-development" element={<Navigate to="/solutions/mobile-app-development" replace />} />
          <Route path="services/data-engineering" element={<Navigate to="/technology/data-engineering" replace />} />
          <Route path="services/cloud-migration" element={<Navigate to="/solutions/cloud-modernization" replace />} />
          <Route path="services/digital-engineering" element={<Navigate to="/services/application-modernization" replace />} />
          <Route path="services/:slug" element={<DetailPage />} />
          <Route
            path="services/:slug/:solutionSlug"
            element={<SolutionPage />}
          />
          <Route path="industries" element={<IndustriesPage />} />
          <Route path="industries/:slug" element={<DetailPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="insights/:slug" element={<InsightDetailPage />} />
          <Route path="technology" element={<TechnologyPage />} />
          <Route path="technology/:slug" element={<TechnologyDetailPage />} />
          <Route path="solutions" element={<Navigate to="/services" replace />} />
          <Route path="solutions/:solutionSlug" element={<SolutionPage />} />
          <Route path="case-studies" element={<CaseStudiesPage />} />
          <Route path="case-studies/:slug" element={<CaseStudyDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="who-we-are" element={<Navigate to="/about" replace />} />
          <Route path="leadership" element={<Navigate to="/about" replace />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="careers/life-at-senzoft" element={<CareerLifePage />} />
          <Route path="careers/benefits" element={<CareerBenefitsPage />} />
          <Route path="careers/openings" element={<PublicJobOpeningsPage />} />
          <Route path="careers/openings/:jobId" element={<PublicJobDetailPage />} />
          <Route path="careers/apply/:jobId" element={<Navigate to="/careers/openings" replace />} />
          <Route
            path="careers/pathways/:pathSlug"
            element={<CareerPathPage />}
          />
          <Route path="careers/:jobId" element={<LegacyCareerRedirect />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="privacy-policy" element={<LegalPage type="privacy" />} />
          <Route path="terms-of-use" element={<LegalPage type="terms" />} />
          <Route
            path="accessibility"
            element={<LegalPage type="accessibility" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
