import { lazy, Suspense } from "react";
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
const CareerPathPage = lazy(() => import("../pages/CareerPathPage"));
const JobPage = lazy(() => import("../pages/JobPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const Loading = () => (
  <div className="grid min-h-screen place-items-center">
    <span
      className="size-10 animate-spin rounded-full border-4 border-brand-orange border-t-transparent"
      aria-label="Loading"
    />
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<DetailPage />} />
          <Route
            path="services/:slug/:solutionSlug"
            element={<SolutionPage />}
          />
          <Route path="industries" element={<IndustriesPage />} />
          <Route path="industries/:slug" element={<DetailPage />} />
          <Route
            path="insights/*"
            element={<Navigate to="/services" replace />}
          />
          <Route
            path="case-studies/*"
            element={<Navigate to="/services" replace />}
          />
          <Route path="about" element={<AboutPage />} />
          <Route path="leadership" element={<Navigate to="/about" replace />} />
          <Route path="careers" element={<CareersPage />} />
          <Route
            path="careers/pathways/:pathSlug"
            element={<CareerPathPage />}
          />
          <Route path="careers/:jobId" element={<JobPage />} />
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
