import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { createSelectableContext } from '../hooks/use-context-selector';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: Error | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
  role?: 'student' | 'teacher';
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

const { Provider, useContextSelector, useEntireContext } = createSelectableContext<AuthContextValue>('Auth');

// Default auth state
const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: true,
  error: null,
};

// Time before access token expiry to trigger refresh (5 minutes)
const REFRESH_THRESHOLD = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem('auth-state');
      return saved ? { ...defaultAuthState, ...JSON.parse(saved) } : defaultAuthState;
    } catch {
      return defaultAuthState;
    }
  });

  const handleError = useCallback((error: unknown) => {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Auth Error:', err);
    setState(prev => ({ ...prev, error: err }));
  }, []);

  // Save auth state to localStorage
  useEffect(() => {
    try {
      if (state.isAuthenticated) {
        localStorage.setItem('auth-state', JSON.stringify({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }));
      } else {
        localStorage.removeItem('auth-state');
      }
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  }, [state]);

  // Token refresh mechanism
  useEffect(() => {
    if (!state.accessToken || !state.refreshToken) return;

    try {
      const token = JSON.parse(atob(state.accessToken.split('.')[1]));
      const expiryTime = token.exp * 1000; // Convert to milliseconds
      const timeToExpiry = expiryTime - Date.now();

      if (timeToExpiry <= REFRESH_THRESHOLD) {
        refreshAccessToken();
      } else {
        // Schedule next refresh
        const refreshTimeout = setTimeout(refreshAccessToken, timeToExpiry - REFRESH_THRESHOLD);
        return () => clearTimeout(refreshTimeout);
      }
    } catch (error) {
      console.error('Failed to process token:', error);
    }
  }, [state.accessToken, state.refreshToken]);

  async function refreshAccessToken() {
    try {
      if (!state.refreshToken) throw new Error('No refresh token available');

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      if (!response.ok) throw new Error('Failed to refresh token');

      const data = await response.json();
      setState(prev => ({
        ...prev,
        accessToken: data.accessToken,
      }));
    } catch (error) {
      handleAuthError(error);
      // Force logout on refresh failure
      await logout();
    }
  }

  function handleAuthError(error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    setState(prev => ({ ...prev, error: err }));
    console.error('Auth Error:', err);
  }

  async function login({ email, password }: LoginCredentials) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');

      const { user, accessToken, refreshToken } = await response.json();

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        loading: false,
        error: null,
      }));
    } catch (error) {
      handleAuthError(error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }

  async function register(data: RegisterData) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Registration failed');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }

  async function logout() {
    try {
      if (state.refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: state.refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState(defaultAuthState);
      localStorage.removeItem('auth-state');
    }
  }

  async function updateUserPreferences(preferences: Partial<User['preferences']>) {
    try {
      if (!state.user || !state.accessToken) throw new Error('Not authenticated');

      const response = await fetch('/api/users/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) throw new Error('Failed to update preferences');

      const updatedUser = await response.json();
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      handleAuthError(error);
    }
  }

  async function resetPassword(email: string) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to initiate password reset');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }

  async function verifyEmail(token: string) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) throw new Error('Failed to verify email');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }

  return (
    <Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUserPreferences,
        resetPassword,
        verifyEmail,
      }}
    >
      {children}
    </Provider>
  );
}

// Hook to access the entire auth state and methods
export function useAuth() {
  return useEntireContext();
}

// Specialized hooks for specific auth state properties
export function useAuthStatus() {
  return useContextSelector(state => ({
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
  }));
}

export function useUser() {
  return useContextSelector(state => state.user);
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: User['role']
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login';
      return null;
    }

    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to unauthorized page
      window.location.href = '/unauthorized';
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}