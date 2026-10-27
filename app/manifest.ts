import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kanti Baca Batang Hari",
    short_name: "Kanti Baca",
    description: "Tutor membaca dan cerita interaktif anak berbasis kearifan lokal Kabupaten Batang Hari.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#065F46",
    lang: "id",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}