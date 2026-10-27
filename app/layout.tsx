import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import RegisterSW from "../components/RegisterSW";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kanti Baca Batang Hari - Tutor Membaca Anak Batang Hari",
  description: "Latihan membaca cerita lokal Batang Hari untuk anak usia 6-10 tahun.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${fredoka.variable} ${plusJakartaSans.variable}`}>
      <body>{children}<RegisterSW /></body>
    </html>
  );
}