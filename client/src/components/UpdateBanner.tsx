import { XCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { usePwa } from '@/hooks/use-pwa';

export function UpdateBanner() {
  const { updateAvailable, applyUpdate } = usePwa();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-[60] w-full bg-primary/10 backdrop-blur border-b border-primary/20"
    >
      <div className="container mx-auto px-4 py-2 flex items-center gap-3 text-sm">
        <RefreshCw className="h-4 w-4 text-primary" aria-hidden />
        <span className="text-foreground">A new version is available.</span>
        <button
          onClick={applyUpdate}
          className="ml-2 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-primary-foreground shadow-sm hover:opacity-95"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Update now
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="ml-auto inline-flex items-center gap-2 rounded-md border px-3 py-1 hover:bg-accent"
          aria-label="Dismiss update notification"
        >
          <XCircle className="h-4 w-4" aria-hidden />
          Later
        </button>
      </div>
    </div>
  );
}

export default UpdateBanner;
