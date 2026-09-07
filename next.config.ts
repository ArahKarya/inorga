import type { NextConfig } from "next";

/**
 * Dua sasaran build:
 * - default `standalone` untuk kontainer Docker / RPi5
 * - `INORGA_TARGET=apk` menghasilkan ekspor statis yang dibungkus Capacitor,
 *   sehingga APK berjalan penuh tanpa server sama sekali
 */
const apk = process.env.INORGA_TARGET === "apk";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: apk ? "export" : "standalone",
  ...(apk ? { images: { unoptimized: true }, trailingSlash: true } : {}),
};

export default nextConfig;
