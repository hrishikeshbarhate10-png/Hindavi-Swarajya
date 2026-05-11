import { Capacitor } from "@capacitor/core";
import { useAdMob } from "@/hooks/use-admob";

/**
 * AdBanner — shows a native AdMob banner on iOS/Android via the Capacitor plugin.
 * On the web, renders a visible placeholder so the layout gap is apparent during development.
 */
export function AdBanner() {
  useAdMob();

  if (Capacitor.isNativePlatform()) {
    return <div className="h-14" aria-hidden="true" />;
  }

  return (
    <div
      data-testid="admob-web-placeholder"
      className="w-full flex items-center justify-center h-14 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 text-muted-foreground/50 text-xs font-medium tracking-wide select-none"
    >
      AdMob Banner — visible on iOS &amp; Android only
    </div>
  );
}
