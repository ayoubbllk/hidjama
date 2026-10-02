export const META_PIXEL_ID = "1096914536426626";

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return false;
  if (params) window.fbq("track", event, params);
  else window.fbq("track", event);
  return true;
}
