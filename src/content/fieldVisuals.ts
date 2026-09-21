import pexelsImages from "./pexels-images.json";

export type FieldImage = { src: string; srcSet: string; alt: string };

const visuals = pexelsImages as Record<string, FieldImage>;

export function getFieldVisual(slug: string) {
  return visuals[slug];
}