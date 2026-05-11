import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.hindavi.swarajya",
  appName: "Hindavi Swarajya",
  webDir: "dist/public",
  server: {
    // During development, point to the live Replit dev server
    // Comment this out before running npx cap sync for production builds
    // url: "https://YOUR-REPLIT-URL.replit.dev",
    // cleartext: true,
  },
  ios: {
    contentInset: "automatic",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
