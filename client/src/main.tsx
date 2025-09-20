import { createRoot } from "react-dom/client";
import { ErrorProvider } from './contexts/ErrorContext';
import { AppStateProvider } from './contexts/AppStateContext';
import { Toaster } from './components/ui/toaster';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ViewportProvider } from './contexts/ViewportContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LearningProvider } from './contexts/LearningContext';
import { BookmarksProvider } from './contexts/BookmarksContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime in v4)
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
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

createRoot(document.getElementById("root")!).render(
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

// In development, actively unregister any existing SW to avoid module graph splits.
if ('serviceWorker' in navigator) {
  if (!import.meta.env.PROD) {
    // Development: ensure no SW is controlling the page
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length) {
          console.log('[SW] Unregistering existing service workers for development...');
        }
        registrations.forEach(reg => reg.unregister());
      }).catch(() => {/* ignore */});
      // Also try to clear SW-related caches to avoid stale index.html in dev
      if ('caches' in window) {
        caches.keys().then(keys => {
          keys.forEach(k => {
            if (k.startsWith('sambhidanx-')) caches.delete(k);
          });
        }).catch(() => {/* ignore */});
      }
    });
  }
}
