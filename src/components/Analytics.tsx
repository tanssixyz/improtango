import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

// Vercel Analytics component - automatically tracks page views and performance
export function Analytics() {
  return <VercelAnalytics />;
}
