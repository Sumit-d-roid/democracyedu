import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useDebouncedCallback } from '../hooks/use-performance';
import { createSelectableContext } from '../hooks/use-context-selector';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Orientation = 'portrait' | 'landscape';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface ViewportState {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  orientation: Orientation;
  deviceType: DeviceType;
  isLandscape: boolean;
  isPortrait: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPwa: boolean;
  isStandalone: boolean;
}

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

function getBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

function getDeviceType(width: number): DeviceType {
  if (width >= breakpoints.lg) return 'desktop';
  if (width >= breakpoints.md) return 'tablet';
  return 'mobile';
}

const { Provider, useContextSelector, useEntireContext } = createSelectableContext<ViewportState>('Viewport');

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ViewportState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0;
    const height = typeof window !== 'undefined' ? window.innerHeight : 0;
    const orientation = height > width ? 'portrait' : 'landscape';

    return {
      width,
      height,
      breakpoint: getBreakpoint(width),
      orientation,
      deviceType: getDeviceType(width),
      isLandscape: orientation === 'landscape',
      isPortrait: orientation === 'portrait',
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg,
      isPwa: window.matchMedia('(display-mode: standalone)').matches,
      isStandalone: window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches,
    };
  });

  // Debounce viewport updates to avoid excessive re-renders
  const debouncedSetState = useDebouncedCallback((updates: Partial<ViewportState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, 150);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = height > width ? 'portrait' : 'landscape';
      const breakpoint = getBreakpoint(width);
      const deviceType = getDeviceType(width);

      debouncedSetState({
        width,
        height,
        breakpoint,
        orientation,
        deviceType,
        isLandscape: orientation === 'landscape',
        isPortrait: orientation === 'portrait',
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
      });
    }

    // Listen for resize and orientation change events
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Initial check
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [debouncedSetState]);

  // Update PWA status when display mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    
    function handleDisplayModeChange(e: MediaQueryListEvent) {
      setState(prev => ({
        ...prev,
        isPwa: e.matches,
        isStandalone: e.matches || window.navigator.standalone || false,
      }));
    }

    mediaQuery.addEventListener('change', handleDisplayModeChange);
    return () => mediaQuery.removeEventListener('change', handleDisplayModeChange);
  }, []);

  return <Provider value={state}>{children}</Provider>;
}

// Hook to access the entire viewport state
export function useViewport() {
  return useEntireContext();
}

// Specialized hooks for specific viewport properties
export function useBreakpoint() {
  return useContextSelector(state => state.breakpoint);
}

export function useDeviceType() {
  return useContextSelector(state => state.deviceType);
}

export function useOrientation() {
  return useContextSelector(state => state.orientation);
}

export function useViewportSize() {
  return useContextSelector(state => ({ width: state.width, height: state.height }));
}

export function useResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T {
  const breakpoint = useBreakpoint();
  const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  
  // Find the closest defined breakpoint value
  const index = breakpointOrder.indexOf(breakpoint);
  for (let i = index; i < breakpointOrder.length; i++) {
    const value = values[breakpointOrder[i]];
    if (value !== undefined) {
      return value;
    }
  }
  
  return defaultValue;
}