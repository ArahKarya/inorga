import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { DemoBar } from "@/components/DemoBar";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "INORGA — Ekosistem Digital Silat",
  description:
    "Platform pemanduan bakat pencak silat tradisi Kota Palembang. Prototipe demo.",
};

export const viewport: Viewport = {
  themeColor: "#0e4547",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-gading-100 antialiased">
        <DemoBar />
        <div className="pt-[52px]">{children}</div>
      </body>
    </html>
  );
}
