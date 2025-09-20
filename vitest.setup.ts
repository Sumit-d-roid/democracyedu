import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Ensure jest-dom matchers are available on vitest expect
expect.extend(matchers);

// JSDOM lacks IndexedDB by default; provide a minimal stub to avoid crashes in hooks
if (!(globalThis as any).indexedDB) {
  (globalThis as any).indexedDB = {
    open: () => ({
      result: {
        createObjectStore: vi.fn(),
        objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      },
      onerror: null,
      onsuccess: null,
      onupgradeneeded: null,
    }),
  } as any;
}

afterEach(() => {
  cleanup();
});