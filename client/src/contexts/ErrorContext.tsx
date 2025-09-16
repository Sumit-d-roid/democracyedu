import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  Component,
  ErrorInfo,
} from 'react';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorContextType {
  errors: Record<string, ErrorState>;
  addError: (contextName: string, error: Error, errorInfo?: ErrorInfo) => void;
  clearError: (contextName: string) => void;
  clearAllErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { fallback: Fallback, children } = this.props;

    if (this.state.hasError && this.state.error) {
      if (Fallback) {
        return <Fallback error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-700">{this.state.error.message}</p>
          <button
            onClick={this.resetError}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}

// Context Provider for Global Error Handling
export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<Record<string, ErrorState>>({});

  const addError = useCallback((contextName: string, error: Error, errorInfo?: ErrorInfo) => {
    setErrors((prev) => ({
      ...prev,
      [contextName]: {
        hasError: true,
        error,
        errorInfo: errorInfo || null,
      },
    }));

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error in ${contextName}:`, error);
      if (errorInfo) {
        console.error('Error Info:', errorInfo);
      }
    }

    // Here you could add error reporting service integration
    // e.g., Sentry, LogRocket, etc.
  }, []);

  const clearError = useCallback((contextName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[contextName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        errors,
        addError,
        clearError,
        clearAllErrors,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}

// Higher Order Component to wrap context providers with error handling
export function withErrorHandling<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  contextName: string
) {
  return function WithErrorHandlingComponent(props: P) {
    const { addError } = useError();

    return (
      <ErrorBoundary onError={(error, errorInfo) => addError(contextName, error, errorInfo)}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// Custom hook for try-catch error handling in contexts
export function useErrorHandler(contextName: string) {
  const { addError } = useError();

  return useCallback(
    async <T,>(promise: Promise<T>) => {
      try {
        return await promise;
      } catch (error) {
        addError(contextName, error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    [addError, contextName]
  );
}
