import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { buildBreadcrumbs } from "../../seo/seo";
export function Breadcrumbs() {
  const items = buildBreadcrumbs(useLocation().pathname);
  if (items.length === 1) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="container-shell py-4 text-xs font-bold text-brand-muted"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li className="flex items-center gap-2" key={item.path}>
            {index > 0 && <ChevronRight size={13} aria-hidden="true" />}
            {index === items.length - 1 ? (
              <span className="text-brand-orange">
                {item.name}
              </span>
            ) : (
              <Link to={item.path}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
