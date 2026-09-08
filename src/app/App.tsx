import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import {
  CaseStudiesPage,
  IndustriesPage,
  InsightsPage,
  ServicesPage,
} from "../pages/ListingPages";
import AboutPage, { LeadershipPage } from "../pages/AboutPage";
import { LegalPage, NotFoundPage, SearchPage } from "../pages/UtilityPages";

const HomePage = lazy(() => import("../pages/HomePage"));
const DetailPage = lazy(() => import("../pages/DetailPage"));
const CareersPage = lazy(() => import("../pages/CareersPage"));
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
          <Route path="industries" element={<IndustriesPage />} />
          <Route path="industries/:slug" element={<DetailPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="insights/:slug" element={<DetailPage />} />
          <Route path="case-studies" element={<CaseStudiesPage />} />
          <Route path="case-studies/:slug" element={<DetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="leadership" element={<LeadershipPage />} />
          <Route path="careers" element={<CareersPage />} />
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
