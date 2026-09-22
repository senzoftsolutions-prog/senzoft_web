import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function ImageHoverCard({
  to,
  image,
  alt,
  children,
  className = "",
}: {
  to: string;
  image: string;
  alt: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} className={`image-hover-card ${className}`}>
      <div className="image-hover-card-media">
        <img src={image} alt={alt} loading="lazy" decoding="async" />
      </div>
      <div className="image-hover-card-panel">{children}</div>
    </Link>
  );
}
