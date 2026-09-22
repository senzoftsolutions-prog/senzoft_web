import pexelsImages from "./pexels-images.json";

export type FieldImage = { src: string; srcSet: string; alt: string };

const visuals = pexelsImages as Record<string, FieldImage>;

const dedicatedFallbacks: Record<string, FieldImage> = {
  "custom-software": {
    src: "/media/campaign-creators-gMsnXqILjp4-unsplash.jpg",
    srcSet: "",
    alt: "Product team collaborating around laptops and a shared workspace",
  },
  "workflow-platforms": {
    src: "/media/pexels-cottonbro-6804071.jpg",
    srcSet: "",
    alt: "Team coordinating a digital workflow together",
  },
  "data-analytics": {
    src: "/media/digital-work.jpg",
    srcSet: "",
    alt: "Analytics dashboard displayed on a laptop",
  },
};

export function getFieldVisual(slug: string) {
  return visuals[slug] ?? dedicatedFallbacks[slug];
}
