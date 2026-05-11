import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  AdMobInitializationOptions,
} from "@capacitor-community/admob";

// Google's official test banner IDs — used as fallback when env vars are not set.
const ANDROID_TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
const IOS_TEST_BANNER_ID = "ca-app-pub-3940256099942544/2934735716";

const ANDROID_BANNER_ID =
  (import.meta.env.VITE_ADMOB_ANDROID_BANNER_ID as string | undefined) ??
  ANDROID_TEST_BANNER_ID;
const IOS_BANNER_ID =
  (import.meta.env.VITE_ADMOB_IOS_BANNER_ID as string | undefined) ??
  IOS_TEST_BANNER_ID;

/**
 * True only in Vite development builds (`npm run dev`).
 * In production builds (`npm run build`) this is false, so real ads are served.
 */
const IS_DEV = import.meta.env.DEV;

function getBannerAdUnitId(): string {
  const platform = Capacitor.getPlatform();
  if (platform === "android") return ANDROID_BANNER_ID;
  if (platform === "ios") return IOS_BANNER_ID;
  return "";
}

let admobInitialized = false;

async function initializeAdMob() {
  if (admobInitialized || !Capacitor.isNativePlatform()) return;
  try {
    const options: AdMobInitializationOptions = {
      testingDevices: [],
      initializeForTesting: IS_DEV,
    };
    await AdMob.initialize(options);
    admobInitialized = true;
  } catch (err) {
    console.warn("[AdMob] Initialization failed:", err);
  }
}

export function useAdMob() {
  const bannerShown = useRef(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let mounted = true;

    async function show() {
      await initializeAdMob();
      if (!mounted) return;

      const adId = getBannerAdUnitId();
      if (!adId) {
        console.warn("[AdMob] No banner ad unit ID configured for this platform.");
        return;
      }

      const options: BannerAdOptions = {
        adId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: IS_DEV,
      };

      try {
        await AdMob.showBanner(options);
        bannerShown.current = true;
      } catch (err) {
        console.warn("[AdMob] showBanner failed:", err);
      }
    }

    show();

    return () => {
      mounted = false;
      if (bannerShown.current) {
        AdMob.hideBanner().catch(() => {});
        bannerShown.current = false;
      }
    };
  }, []);
}
