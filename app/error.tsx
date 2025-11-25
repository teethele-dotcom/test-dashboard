'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function RootError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Root Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">
                Something went wrong!
              </h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>

            <div className="space-y-4">
              <Button onClick={reset} className="w-full">
                Try Again
              </Button>

              <div className="text-sm text-muted-foreground">
                <details className="cursor-pointer">
                  <summary>Technical Details</summary>
                  <div className="mt-2 p-3 bg-muted rounded-md text-left text-xs font-mono overflow-x-auto">
                    <div>Error: {error.message}</div>
                    {error.digest && <div>Digest: {error.digest}</div>}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
