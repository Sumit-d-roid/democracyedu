import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      // NOTE: Fast Refresh intentionally disabled by disabling HMR below (server.hmr = false).
      // The older 'fastRefresh' option is no longer part of the plugin config surface in v4+.
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'client', 'src'),
      '@shared': path.resolve(import.meta.dirname, 'shared'),
      '@assets': path.resolve(import.meta.dirname, 'attached_assets'),
    },
  },
  root: path.resolve(import.meta.dirname, 'client'),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    // Explicitly disable HMR until react-refresh preamble issue is resolved
    hmr: false,
    fs: {
      strict: true,
      deny: ['**/.*'],
    },
  },
});
