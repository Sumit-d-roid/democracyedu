import { createRoot } from 'react-dom/client';
import { ErrorProvider } from './contexts/ErrorContext';
import { AppStateProvider } from './contexts/AppStateContext';
import { Toaster } from './components/ui/toaster';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ViewportProvider } from './contexts/ViewportContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LearningProvider } from './contexts/LearningContext';
import { BookmarksProvider } from './contexts/BookmarksContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { enableServerLogging } from './lib/serverLogger';
import App from './App';
import './index.css';

// Development-only helpers
if (import.meta.env.DEV) {
  enableServerLogging();

  // In development, an aggressive service worker cache previously captured
  // Vite virtual modules like /@react-refresh leading to stale runtime code
  // (missing named exports) and the error: "The requested module '/@react-refresh' does not provide an export named 'injectIntoGlobalHook'".
  // To avoid ALL SW interference with Vite HMR, we fully unregister any
  // existing service workers and clear related caches during dev.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const reg of regs) {
        reg.unregister().catch(() => {
          /* ignore */
        });
      }
    });
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const k of keys) {
          if (k.startsWith('sambhidanx-')) {
            caches.delete(k).catch(() => {
              /* ignore */
            });
          }
        }
      });
    }
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime in v4)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthenticatedApp() {
  const { user } = useAuth();
  return (
    <LearningProvider userId={user?.id}>
      <BookmarksProvider>
        <App />
      </BookmarksProvider>
    </LearningProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <ErrorProvider>
    <QueryClientProvider client={queryClient}>
      <ViewportProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppStateProvider>
              <AuthenticatedApp />
              <Toaster />
            </AppStateProvider>
          </AuthProvider>
        </LanguageProvider>
      </ViewportProvider>
    </QueryClientProvider>
  </ErrorProvider>
);

// Register service worker ONLY in production to prevent dev caching issues.
if (!import.meta.env.DEV && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const versionParam = `v=${Date.now()}`; // force fresh fetch
    navigator.serviceWorker
      .register(`/service-worker.js?${versionParam}`)
      .then((registration) => {
        console.log('ServiceWorker new registration scope:', registration.scope);
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error);
      });
  });

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'SW_ACTIVATED') {
      console.log('[SW] Activated version', event.data.version);
      if (!sessionStorage.getItem('sw-reloaded')) {
        sessionStorage.setItem('sw-reloaded', '1');
        window.location.reload();
      }
    }
  });
}
