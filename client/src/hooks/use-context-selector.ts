import React, { createContext, useContext, useRef, useCallback } from 'react';
import { useContextMetrics } from './use-performance';

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

    return (
      <Context.Provider value={stableValue.current}>
        {children}
      </Context.Provider>
    );
  }

  // Hook for selecting specific parts of the context state
  function useContextSelector<S>(selector: Selector<T, S>): S {
    useContextMetrics(contextName);
    
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${contextName} must be used within a ${contextName}Provider`);
    }

    // Memoize the selector result
    const lastValue = useRef<S>();
    const lastContext = useRef<T>();

    if (
      lastContext.current !== context ||
      !lastValue.current ||
      selector(context) !== selector(lastContext.current)
    ) {
      lastValue.current = selector(context);
      lastContext.current = context;
    }

    return lastValue.current;
  }

  // Hook for using the entire context
  function useEntireContext(): T {
    useContextMetrics(contextName);
    
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