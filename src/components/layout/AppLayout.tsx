import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { ScrollProgress } from "../ui/ScrollProgress";
export function AppLayout() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Breadcrumbs />
      <Footer />
    </>
  );
}
