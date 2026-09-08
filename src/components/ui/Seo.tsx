import { useEffect } from "react";
export function Seo({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  useEffect(() => {
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    window.scrollTo({ top: 0 });
  }, [title, description]);
  return null;
}
