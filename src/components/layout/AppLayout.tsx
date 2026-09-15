import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieConsent } from "../ui/CookieConsent";
import { ScrollProgress } from "../ui/ScrollProgress";
import { ScrollReveal } from "../ui/ScrollReveal";
import { PageMotion } from "../ui/PageMotion";
import { Breadcrumbs } from "../ui/Breadcrumbs";
export function AppLayout() {
  return (
    <>
      <ScrollProgress />
      <ScrollReveal />
      <PageMotion />
      <Header />
      <main id="main">
        <Breadcrumbs />
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
