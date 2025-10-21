// Privacy-focused analytics hook for custom events
export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    // Only track in production and when analytics endpoint is available
    if (import.meta.env.DEV) return;

    // For static site deployment, just log analytics events
    // TODO: Implement client-side analytics or third-party service
    if (import.meta.env.DEV) {
      console.log('Analytics event:', {
        event: eventName,
        properties: properties || {},
        path: window.location.pathname,
        timestamp: Date.now(),
      });
    }
  };

  return { trackEvent };
}