import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Defensive: only extend if matchers is a non-null object
if (matchers && typeof matchers === 'object') {
  // @ts-ignore - vitest expect has extend
  expect.extend(matchers as any);
}

afterEach(() => {
  try {
    cleanup();
  } catch {
    // ignore cleanup errors for non-DOM tests
  }
});