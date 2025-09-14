import { createRoot } from "react-dom/client";
import { ErrorProvider } from './contexts/ErrorContext';
import { AppStateProvider } from './contexts/AppStateContext';
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
      cacheTime: 30 * 60 * 1000, // 30 minutes
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
            </AppStateProvider>
          </AuthProvider>
        </LanguageProvider>
      </ViewportProvider>
    </QueryClientProvider>
  </ErrorProvider>
);
