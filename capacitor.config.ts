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
  plugins: {
    AdMob: {
      // Test app IDs — replace with real IDs from https://admob.google.com before publishing
      // Android real app ID goes in AndroidManifest.xml (com.google.android.gms.ads.APPLICATION_ID)
      // iOS real app ID goes in Info.plist (GADApplicationIdentifier)
      appIdIos: process.env.VITE_ADMOB_IOS_APP_ID ?? "ca-app-pub-3940256099942544~1458002511",
      appIdAndroid: process.env.VITE_ADMOB_ANDROID_APP_ID ?? "ca-app-pub-3940256099942544~3347511713",
    },
  },
};

export default config;
