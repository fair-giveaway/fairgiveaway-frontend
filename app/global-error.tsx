'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#09090b', color: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>500</h1>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Something went terribly wrong</h2>
          <p style={{ color: '#a1a1aa', marginBottom: 32, lineHeight: 1.6 }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: '#6366f1',
              color: '#ffffff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
