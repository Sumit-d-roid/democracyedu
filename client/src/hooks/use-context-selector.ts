import React, { createContext, useContext, useRef, useCallback } from 'react';

type Selector<T, S> = (state: T) => S;

// Create a context with selectors support
export function createSelectableContext<T>(contextName: string) {
  const Context = createContext<T | undefined>(undefined);

  function Provider({ value, children }: { value: T; children: React.ReactNode }) {
    const stableValue = useRef(value);
    
    // Update the ref if the value changes
    if (value !== stableValue.current) {
      stableValue.current = value;
    }

    return React.createElement(Context.Provider, 
      { value: stableValue.current },
      children
    );
  }

  // Hook for selecting specific parts of the context state
  function useContextSelector<S>(selector: Selector<T, S>): S {
    // Removed useContextMetrics to fix hook call issue
    
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${contextName} must be used within a ${contextName}Provider`);
    }

    // Simplified selector without complex memoization to avoid hook issues
    return selector(context);
  }

  // Hook for using the entire context
  function useEntireContext(): T {
    // Removed useContextMetrics to fix hook call issue
    
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${contextName} must be used within a ${contextName}Provider`);
    }
    return context;
  }

  return {
    Provider,
    useContextSelector,
    useEntireContext
  };
}

// Example usage:
// const { Provider: ProgressProvider, useContextSelector: useProgressSelector } = 
//   createSelectableContext<ProgressContextType>('Progress');