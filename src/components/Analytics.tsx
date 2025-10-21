import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  trackWebVitals,
  trackBundlePerformance,
  trackScrollDepth,
} from "@/lib/performance";
import type { WebVitalsMetric } from "@/lib/performance";

// Simple privacy-focused analytics component
// This tracks page views without cookies or personal data
export function Analytics() {
  const location = useLocation();

  const trackPageView = (path: string) => {
    // For static site deployment, disable API calls to prevent errors
    // TODO: Implement client-side analytics service like Plausible or Google Analytics
    if (import.meta.env.DEV) {
      console.log("Page view:", {
        path,
        timestamp: Date.now(),
        referrer: document.referrer || null,
        userAgent: navigator.userAgent || null,
      });
    }
  };

  // Track initial load and performance metrics once
  useEffect(() => {
    // Only track in production
    if (import.meta.env.DEV) return;

    // Disable performance tracking for static site deployment
    // TODO: Implement client-side performance monitoring service
    if (import.meta.env.DEV) {
      // Track Core Web Vitals in development only
      trackWebVitals((metric: WebVitalsMetric) => {
        console.log("Web Vital:", metric);
      });

      // Track bundle performance after initial load
      setTimeout(trackBundlePerformance, 2000);

      // Track scroll depth
      trackScrollDepth();
    }
  }, []);

  // Track route changes
  useEffect(() => {
    // Only track in production
    if (import.meta.env.DEV) return;
    
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null; // This component doesn't render anything
}
