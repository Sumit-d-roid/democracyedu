import React, { createContext, useContext, useRef } from 'react';

type Selector<T, S> = (state: T) => S;

// Create a context with selectors support
export function createSelectableContext<T>(contextName: string) {
  const Context = createContext<T | undefined>(undefined);

  function Provider({ value, children }: { value: T; children: React.ReactNode }) {
    // Use a more straightforward approach without ref optimization for now
    return React.createElement(Context.Provider, { value }, children);
  }

  // Hook for selecting specific parts of the context state
  function useContextSelector<S>(selector: Selector<T, S>): S {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${contextName} must be used within a ${contextName}Provider`);
    }

    // For now, just return the selected value directly
    // TODO: Add memoization optimization later
    return selector(context);
  }

  // Hook for using the entire context
  function useEntireContext(): T {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${contextName} must be used within a ${contextName}Provider`);
    }
    return context;
  }

  return {
    Provider,
    useContextSelector,
    useEntireContext,
  };
}

// Example usage:
// const { Provider: ProgressProvider, useContextSelector: useProgressSelector } =
//   createSelectableContext<ProgressContextType>('Progress');
