import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { ScrollProgress } from "../ui/ScrollProgress";
import { ScrollReveal } from "../ui/ScrollReveal";
export function AppLayout() {
  return (
    <>
      <ScrollProgress />
      <ScrollReveal />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Breadcrumbs />
      <Footer />
    </>
  );
}
