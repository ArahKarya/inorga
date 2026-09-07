import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Tiga peran huruf mengikuti Apex Lab: Archivo untuk judul display yang berat,
 * JetBrains Mono untuk label dan angka, Inter untuk teks bacaan.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-jb",
  display: "swap",
});

export const metadata: Metadata = {
  title: "INORGA — Ekosistem Digital Silat",
  description:
    "Platform pemanduan bakat pencak silat tradisi Kota Palembang. Prototipe demo.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "INORGA",
  },
  icons: { icon: "/ikon-192.png", apple: "/ikon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${archivo.variable} ${inter.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-ink-800 antialiased">{children}</body>
    </html>
  );
}
