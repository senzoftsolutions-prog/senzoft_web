import { ContentGrid, type ContentGridItem } from "./ContentGrid";
import { Section } from "../ui/Section";

export function RelatedContent({ items, heading = "Continue exploring", eyebrow = "How this connects", tone = "cream" }: {
  items: ContentGridItem[]; heading?: string; eyebrow?: string; tone?: "light" | "cream" | "sage" | "peach";
}) {
  if (!items.length) return null;
  return <Section tone={tone} eyebrow={eyebrow} heading={heading}><div className="mt-10"><ContentGrid items={items} basePath=""/></div></Section>;
}
