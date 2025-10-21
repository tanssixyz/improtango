// Core Web Vitals and performance monitoring
export interface WebVitalsMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

export interface PerformanceData {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

// Track Core Web Vitals metrics
export function trackWebVitals(onMetric: (metric: WebVitalsMetric) => void) {
  // Only track in production
  if (import.meta.env.DEV) return;

  // Dynamic import to avoid bundling web-vitals in dev
  import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS(onMetric);
    onFCP(onMetric);
    onLCP(onMetric);
    onTTFB(onMetric);
    onINP?.(onMetric); // INP might not be available in all versions
  }).catch(error => {
    console.warn('Failed to load web-vitals:', error);
  });
}

// Send performance data to analytics endpoint
export function sendPerformanceData(data: PerformanceData) {
  // For static site deployment, disable API calls to prevent 405 errors
  // TODO: Implement client-side performance tracking or third-party service
  if (import.meta.env.DEV) {
    console.log('Performance data:', data);
  }
}

// Track custom performance metrics
export function trackCustomMetric(name: string, value: number) {
  const data: PerformanceData = {
    name,
    value,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };
  
  sendPerformanceData(data);
}

// Monitor bundle loading times
export function trackBundlePerformance() {
  if ('performance' in window && performance.getEntriesByType) {
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    if (navigationEntries.length > 0) {
      const nav = navigationEntries[0];
      
      // Track key navigation timings
      trackCustomMetric('dom_content_loaded', nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart);
      trackCustomMetric('load_complete', nav.loadEventEnd - nav.loadEventStart);
      trackCustomMetric('dom_interactive', nav.domInteractive - nav.fetchStart);
    }

    // Track JavaScript bundle sizes and load times
    resourceEntries
      .filter(entry => entry.name.includes('.js') && entry.transferSize)
      .forEach(entry => {
        const bundleName = entry.name.split('/').pop()?.split('-')[0] || 'unknown';
        trackCustomMetric(`bundle_${bundleName}_size`, entry.transferSize);
        trackCustomMetric(`bundle_${bundleName}_load_time`, entry.responseEnd - entry.requestStart);
      });
  }
}

// Image loading performance
export function trackImagePerformance(src: string, loadTime: number) {
  const imageName = src.split('/').pop()?.split('.')[0] || 'unknown';
  trackCustomMetric(`image_${imageName}_load_time`, loadTime);
}

// Scroll depth tracking
export function trackScrollDepth() {
  let maxScrollDepth = 0;
  let scrollTimer: number | null = null;

  const updateScrollDepth = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
    
    if (scrollPercentage > maxScrollDepth) {
      maxScrollDepth = scrollPercentage;
      
      // Send scroll depth at 25%, 50%, 75%, 100%
      if ([25, 50, 75, 100].includes(scrollPercentage)) {
        trackCustomMetric('scroll_depth', scrollPercentage);
      }
    }
  };

  const handleScroll = () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(updateScrollDepth, 100);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    window.removeEventListener('scroll', handleScroll);
    // Send final scroll depth
    if (maxScrollDepth > 0) {
      trackCustomMetric('final_scroll_depth', maxScrollDepth);
    }
  });
}