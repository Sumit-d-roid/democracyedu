import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';

// Generic memoization hook for expensive operations
export function useMemoizedValue<T>(value: T, deps: React.DependencyList): T {
  return useMemo(() => value, deps);
}

// Debounce hook for rate-limiting state updates
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Debounce hook for functions
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;
}

// Throttle hook for limiting the rate of function calls
export function useThrottle<T extends (...args: any[]) => any>(func: T, delay: number): T {
  const lastRan = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRan.current >= delay) {
        func(...args);
        lastRan.current = now;
      }
    },
    [func, delay]
  ) as T;
}

// Hook for tracking expensive renders and logging performance issues
export function useRenderTracking(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    renderCount.current += 1;

    if (timeSinceLastRender > 16) {
      // More than 1 frame (60fps)
      console.warn(
        `Slow render detected in ${componentName}:`,
        `Render #${renderCount.current} took ${timeSinceLastRender.toFixed(2)}ms`
      );
    }

    lastRenderTime.current = currentTime;
  });
}

// Hook for detecting unnecessary re-renders
export function useRenderOptimization(componentName: string, props: Record<string, any>) {
  const prevProps = useRef<Record<string, any>>({});

  useEffect(() => {
    const changedProps: Record<string, { prev: any; next: any }> = {};

    Object.entries(props).forEach(([key, value]) => {
      if (prevProps.current[key] !== value) {
        changedProps[key] = {
          prev: prevProps.current[key],
          next: value,
        };
      }
    });

    if (Object.keys(changedProps).length > 0) {
      console.log(`${componentName} re-rendered due to prop changes:`, changedProps);
    }

    prevProps.current = props;
  });
}

// Hook for caching expensive calculations
export function useCalculationCache<T>(calculation: () => T, deps: any[], cacheSize: number = 10) {
  const cache = useRef<Map<string, T>>(new Map());

  return useMemo(() => {
    const key = JSON.stringify(deps);
    if (cache.current.has(key)) {
      return cache.current.get(key)!;
    }

    const result = calculation();

    // Implement LRU cache
    if (cache.current.size >= cacheSize) {
      const iteratorResult = cache.current.keys().next();
      if (!iteratorResult.done) {
        cache.current.delete(iteratorResult.value as string);
      }
    }

    cache.current.set(key, result);
    return result;
  }, deps);
}

// Hook for detecting context consumers and measuring context usage
export function useContextMetrics(contextName: string) {
  useEffect(() => {
    const metric = {
      contextName,
      timestamp: Date.now(),
      componentPath: new Error().stack
        ?.split('\n')[2]
        ?.trim()
        ?.replace(/^at\s+/, ''),
    };

    // You could send this to your analytics or monitoring service
    if (process.env.NODE_ENV === 'development') {
      console.log('Context usage metric:', metric);
    }
  }, [contextName]);
}
