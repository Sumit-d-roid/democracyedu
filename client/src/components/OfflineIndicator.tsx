import { useOfflineSupport } from '../hooks/use-offline-support';
import { WifiOff, Database, Cloud } from 'lucide-react';

export function OfflineIndicator() {
  const { isOnline, hasOfflineContent, pendingSyncs } = useOfflineSupport();

  if (isOnline && !hasOfflineContent) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-lg bg-background border">
        {!isOnline && (
          <>
            <WifiOff className="h-4 w-4 text-yellow-500" />
            <span>Offline Mode</span>
          </>
        )}
        {hasOfflineContent && (
          <>
            <Database className="h-4 w-4 text-blue-500" />
            <span>Saved Locally</span>
          </>
        )}
        {isOnline && pendingSyncs > 0 && (
          <>
            <Cloud className="h-4 w-4 text-green-500 animate-spin" />
            <span>Syncing...</span>
          </>
        )}
      </div>
    </div>
  );
}