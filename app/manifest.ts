import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AICraft Learning",
    short_name: "AICraft",
    description: "AI proficiency as a craft",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a4d3a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
