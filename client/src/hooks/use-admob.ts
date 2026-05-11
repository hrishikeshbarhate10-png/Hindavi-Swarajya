import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";

const ANDROID_TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
const IOS_TEST_BANNER_ID = "ca-app-pub-3940256099942544/2934735716";

const ANDROID_BANNER_ID =
  (import.meta.env.VITE_ADMOB_ANDROID_BANNER_ID as string | undefined) ??
  ANDROID_TEST_BANNER_ID;
const IOS_BANNER_ID =
  (import.meta.env.VITE_ADMOB_IOS_BANNER_ID as string | undefined) ??
  IOS_TEST_BANNER_ID;

const IS_DEV = import.meta.env.DEV;

function getBannerAdUnitId(): string {
  const platform = Capacitor.getPlatform();
  if (platform === "android") return ANDROID_BANNER_ID;
  if (platform === "ios") return IOS_BANNER_ID;
  return "";
}

let admobInitialized = false;

async function getAdMob() {
  // Dynamic import with vite-ignore so Vite does not attempt to statically
  // resolve this package (its dist/esm/index.js does not exist on web builds).
  // At runtime on native platforms the Capacitor bridge provides the module.
  const mod = await import(/* @vite-ignore */ "@capacitor-community/admob");
  return mod;
}

async function initializeAdMob() {
  if (admobInitialized || !Capacitor.isNativePlatform()) return;
  try {
    const { AdMob } = await getAdMob();
    await AdMob.initialize({
      testingDevices: [],
      initializeForTesting: IS_DEV,
    });
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
        console.warn("[AdMob] No banner ad unit ID for this platform.");
        return;
      }

      try {
        const { AdMob, BannerAdSize, BannerAdPosition } = await getAdMob();
        await AdMob.showBanner({
          adId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: IS_DEV,
        });
        bannerShown.current = true;
      } catch (err) {
        console.warn("[AdMob] showBanner failed:", err);
      }
    }

    show();

    return () => {
      mounted = false;
      if (bannerShown.current) {
        getAdMob()
          .then(({ AdMob }) => AdMob.hideBanner())
          .catch(() => {});
        bannerShown.current = false;
      }
    };
  }, []);
}
