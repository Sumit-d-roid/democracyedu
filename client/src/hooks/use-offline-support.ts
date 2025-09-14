import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../hooks/use-toast';

interface Progress {
  id?: number;
  timestamp: number;
  data: any;
}

interface OfflineState {
  isOnline: boolean;
  hasOfflineContent: boolean;
  pendingSyncs: number;
}

interface IDBStoreWithMethods extends IDBObjectStore {
  add(value: any): IDBRequest<IDBValidKey>;
  getAll(): IDBRequest<any[]>;
  clear(): IDBRequest<undefined>;
}

export function useOfflineSupport() {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    hasOfflineContent: false,
    pendingSyncs: 0,
  });

  const { toast } = useToast();
  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    toast({
      title: type === 'error' ? 'Error' : 'Notification',
      description: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  };

  // Check if service worker is supported
  const isSupported = 'serviceWorker' in navigator;

  // Register service worker
  useEffect(() => {
    if (!isSupported) return;

    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful');
        
        // Check for background sync support
        if ('sync' in registration && typeof (registration as any).sync?.register === 'function') {
          (registration as any).sync.register('syncProgress')
            .then(() => console.log('Background sync registered'))
            .catch((err: Error) => console.error('Background sync registration failed:', err));
        }
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error);
      });
  }, [isSupported]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      addNotification('Back online! Syncing your progress...', 'success');
      syncOfflineProgress();
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      addNotification('You are offline. Your progress will be saved locally.', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track pending syncs
  const syncOfflineProgress = useCallback(async () => {
    if (!state.isOnline || !state.pendingSyncs) return;

    try {
      const db = await openDB();
      const transaction = db.transaction('progress', 'readwrite');
      const store = transaction.objectStore('progress') as IDBStoreWithMethods;
      
      // Get all pending progress items
      const pendingProgress = await new Promise<Progress[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Sync each item
      for (const progress of pendingProgress) {
        try {
          // Here you would make your API call to sync the progress
          await fetch('/api/v1/progress/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(progress),
          });
        } catch (error) {
          console.error('Failed to sync item:', error);
          continue;
        }
      }

      // Clear synced items
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      setState(prev => ({ ...prev, pendingSyncs: 0, hasOfflineContent: false }));
      addNotification('Progress synced successfully!', 'success');
    } catch (error) {
      console.error('Failed to sync progress:', error);
      addNotification('Failed to sync progress. Will try again later.', 'error');
    }
  }, [state.isOnline, state.pendingSyncs]);

  // Save progress locally when offline
  const saveOfflineProgress = useCallback(async (data: any) => {
    try {
      const db = await openDB();
      const transaction = db.transaction('progress', 'readwrite');
      const store = transaction.objectStore('progress') as IDBStoreWithMethods;

      const progress: Progress = {
        timestamp: Date.now(),
        data,
      };

      await new Promise<IDBValidKey>((resolve, reject) => {
        const request = store.add(progress);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      setState(prev => ({ 
        ...prev, 
        pendingSyncs: prev.pendingSyncs + 1,
        hasOfflineContent: true
      }));
      addNotification('Progress saved offline', 'info');
    } catch (error) {
      console.error('Failed to save progress:', error);
      addNotification('Failed to save progress offline', 'error');
    }
  }, []);

  return {
    isOnline: state.isOnline,
    hasOfflineContent: state.hasOfflineContent,
    pendingSyncs: state.pendingSyncs,
    isSupported,
    saveOfflineProgress,
    syncOfflineProgress,
  };
}

// Helper function to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('sambhidanx-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

