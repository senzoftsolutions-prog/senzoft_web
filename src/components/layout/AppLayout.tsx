import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Breadcrumbs } from "../ui/Breadcrumbs";
export function AppLayout() {
  return (
    <>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Breadcrumbs />
      <Footer />
    </>
  );
}
