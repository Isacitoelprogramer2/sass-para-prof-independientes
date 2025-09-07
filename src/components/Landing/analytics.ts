// Utilidad de tracking compatible con gtag y GTM
export function track(event: string, payload: Record<string, any> = {}) {
  if (typeof window !== "undefined") {
    // Google Tag (gtag)
    // @ts-ignore
    if (window.gtag) {
      // @ts-ignore
      window.gtag("event", event, payload);
    }
    // Google Tag Manager
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    window.dataLayer.push({ event, ...payload });
    // Fallback dev
    if (!("gtag" in window)) {
      // eslint-disable-next-line no-console
      console.log("[track]", event, payload);
    }
  }
}
