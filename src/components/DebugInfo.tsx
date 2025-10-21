// Debug component for deployment issues - remove after fixing
export function DebugInfo() {
  // Only show in development or when there are issues
  if (import.meta.env.PROD && import.meta.env.VITE_CONVEX_URL) {
    return null;
  }

  const envVars = {
    NODE_ENV: import.meta.env.NODE_ENV,
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV,
    VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL ? '✓ Set' : '✗ Missing',
    BASE_URL: import.meta.env.BASE_URL,
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#ff0000',
      color: 'white',
      padding: '1rem',
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <h3>Debug Info (Remove after deployment fix):</h3>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>
    </div>
  );
}