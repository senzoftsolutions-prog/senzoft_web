import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
export function Breadcrumbs() {
  const parts = useLocation().pathname.split("/").filter(Boolean);
  if (!parts.length) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="container-shell py-4 text-xs font-bold text-brand-muted"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/">Home</Link>
        </li>
        {parts.map((part, index) => (
          <li className="flex items-center gap-2" key={part}>
            <ChevronRight size={13} />
            {index === parts.length - 1 ? (
              <span className="text-brand-orange">
                {part.replaceAll("-", " ")}
              </span>
            ) : (
              <Link to={`/${parts.slice(0, index + 1).join("/")}`}>
                {part.replaceAll("-", " ")}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
