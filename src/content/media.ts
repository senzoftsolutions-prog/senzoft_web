import imported from "./imported-media.json";
interface MediaAsset {
  src?: string;
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
  strategy: {
    src: "/media/8814715-uhd_3840_2160_25fps.mp4",
    poster: "/media/campaign-creators-gMsnXqILjp4-unsplash.jpg",
    credit: "Pexels / Unsplash",
    title: "A business team reviewing strategy together",
    source: "https://www.pexels.com/video/4974884/",
  },
  engineering: {
    src: "/media/4974884-hd_1920_1080_25fps.mp4",
    poster: "/media/pexels-cottonbro-6804071.jpg",
    credit: "Pexels",
    title: "Software engineers collaborating around their work",
    source: "https://www.pexels.com/video/7534267/",
  },
  cloudSecurity: {
    src: "/media/7534267-hd_1920_1080_25fps.mp4",
    poster: "/media/cybersecurity-concept-illustration.jpg",
    credit: "Pexels",
    title: "Cybersecurity monitoring and secure digital access",
    source: "https://www.pexels.com/video/7534267/",
  },
  cloudMigration: {
    src: "/media/128210-747086064_medium.mp4",
    poster: "/media/cybersecurity-concept-illustration.jpg",
    credit: "Pexels",
    title: "Connected cloud services and mobile workloads",
    source: "https://www.pexels.com/video/128210/",
  },
  dataAnalytics: {
    src: "/media/gettyimages-1264338570-640_adpp.mp4",
    poster: "/media/digital-work.jpg",
    credit: "Getty Images",
    title: "Business data, charts and analytical reporting",
    source: "https://www.gettyimages.com/",
  },
  delivery: {
    src: "/media/team-collaboration.mp4",
    poster: "/media/pexels-cottonbro-6804071.jpg",
    credit: "Pexels",
    title: "A technology team delivering software together",
    source: "https://www.pexels.com/video/128210/",
  },
  leadership: {
    src: "/media/8814715-uhd_3840_2160_25fps.mp4",
    poster: "/media/campaign-creators-gMsnXqILjp4-unsplash.jpg",
    credit: "Getty Images",
    title: "Business leaders in a collaborative working session",
    source: "https://www.gettyimages.com/",
  },
  devops: {
    poster: "/media/devops-platform-engineering.png",
    credit: "Provided asset",
    title: "DevOps continuous delivery and operations",
    source: "",
  },
} as const;
export type MediaKey = keyof typeof defaults;

export const media: Record<MediaKey, MediaAsset> = { ...defaults, ...imported };
