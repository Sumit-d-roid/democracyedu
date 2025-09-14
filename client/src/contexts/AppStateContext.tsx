import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'default' | 'high-contrast';

interface AppState {
  theme: Theme;
  colorScheme: ColorScheme;
  isOnline: boolean;
  lastSyncTime: number | null;
  isMenuOpen: boolean;
  isSidebarCollapsed: boolean;
  notifications: { id: string; message: string; type: 'info' | 'success' | 'error' | 'warning' }[];
}

interface AppStateContextType {
  state: AppState;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleMenu: () => void;
  toggleSidebar: () => void;
  addNotification: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  removeNotification: (id: string) => void;
}

const defaultState: AppState = {
  theme: 'system',
  colorScheme: 'default',
  isOnline: true,
  lastSyncTime: null,
  isMenuOpen: false,
  isSidebarCollapsed: false,
  notifications: [],
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Create a BroadcastChannel for cross-tab state sync
const broadcastChannel = typeof window !== 'undefined' ? new BroadcastChannel('app-state') : null;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('app-state');
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  });

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle theme system preference changes
  useEffect(() => {
    if (state.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [state.theme]);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('app-state', JSON.stringify(state));
  }, [state]);

  // Handle cross-tab state sync
  useEffect(() => {
    if (!broadcastChannel) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'STATE_UPDATE') {
        setState(prev => ({ ...prev, ...event.data.payload }));
      }
    };

    broadcastChannel.addEventListener('message', handleMessage);
    return () => broadcastChannel.removeEventListener('message', handleMessage);
  }, []);

  // Apply theme and color scheme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    if (state.theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    } else {
      root.classList.toggle('dark', state.theme === 'dark');
    }

    // Apply color scheme
    root.classList.toggle('high-contrast', state.colorScheme === 'high-contrast');
  }, [state.theme, state.colorScheme]);

  const setTheme = (theme: Theme) => {
    setState(prev => ({ ...prev, theme }));
    broadcastChannel?.postMessage({ type: 'STATE_UPDATE', payload: { theme } });
  };

  const setColorScheme = (colorScheme: ColorScheme) => {
    setState(prev => ({ ...prev, colorScheme }));
    broadcastChannel?.postMessage({ type: 'STATE_UPDATE', payload: { colorScheme } });
  };

  const toggleMenu = () => {
    setState(prev => ({ ...prev, isMenuOpen: !prev.isMenuOpen }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, isSidebarCollapsed: !prev.isSidebarCollapsed }));
    broadcastChannel?.postMessage({
      type: 'STATE_UPDATE',
      payload: { isSidebarCollapsed: !state.isSidebarCollapsed }
    });
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
    try {
      const id = Date.now().toString();
      setState(prev => ({
        ...prev,
        notifications: [...prev.notifications, { id, message, type }],
      }));

      // Auto-remove notifications after 5 seconds
      setTimeout(() => removeNotification(id), 5000);
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  };

  const removeNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  };

  return (
    <AppStateContext.Provider
      value={{
        state,
        setTheme,
        setColorScheme,
        toggleMenu,
        toggleSidebar,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

// Optional: Export a hook for notifications only to prevent unnecessary re-renders
export function useNotifications() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useNotifications must be used within an AppStateProvider');
  }
  return {
    notifications: context.state.notifications,
    addNotification: context.addNotification,
    removeNotification: context.removeNotification,
  };
}

// Optional: Export hooks for specific state slices
export function useTheme() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useTheme must be used within an AppStateProvider');
  }
  return {
    theme: context.state.theme,
    colorScheme: context.state.colorScheme,
    setTheme: context.setTheme,
    setColorScheme: context.setColorScheme,
  };
}