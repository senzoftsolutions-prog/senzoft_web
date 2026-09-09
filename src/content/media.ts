import imported from "./imported-media.json";
interface MediaAsset {
  src: string;
  poster: string;
  title: string;
  source: string;
  credit: string;
}
const defaults = {
  workplace: {
    src: "/media/workplace.mp4",
    poster: "/media/workplace.jpg",
    credit: "Mixkit",
    title: "People working in a shared office",
    source: "https://mixkit.co/free-stock-video/busy-office-space-918/",
  },
  digital: {
    src: "/media/digital-work.mp4",
    poster: "/media/digital-work.jpg",
    credit: "Mixkit",
    title: "Working with business data on a laptop",
    source: "https://mixkit.co/free-stock-video/man-working-on-his-laptop-308/",
  },
  collaboration: {
    src: "/media/collaboration.mp4",
    poster: "/media/collaboration.jpg",
    credit: "Mixkit",
    title: "A team discussing plans around a table",
    source:
      "https://mixkit.co/free-stock-video/business-people-at-work-meeting-4809/",
  },
} as const;
export type MediaKey = keyof typeof defaults;

export const media: Record<MediaKey, MediaAsset> = { ...defaults, ...imported };
