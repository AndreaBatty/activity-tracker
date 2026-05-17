import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Activity Tracker",
    short_name: "Tracker",
    description: "Un tracker personale per attività, abitudini e progressi.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7F1E3",
    theme_color: "#66714A",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}