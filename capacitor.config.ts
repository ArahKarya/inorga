import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Cangkang Android untuk INORGA.
 *
 * `webDir: "out"` menunjuk ke hasil ekspor statis (`INORGA_TARGET=apk pnpm build`),
 * sehingga APK berjalan penuh tanpa server — penting untuk demo di GOR yang
 * sinyalnya tidak bisa diandalkan.
 */
const config: CapacitorConfig = {
  appId: "id.arahkarya.inorga",
  appName: "INORGA",
  webDir: "out",
  android: {
    backgroundColor: "#171717",
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
