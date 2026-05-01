/* -----------------------------------------------------------------
 * File:    frontend/vite.config.js
 * Purpose: Vite build configuration for the Cognifer React frontend
 *
 * Key changes in this fix:
 *   1. outDir: 'build'  — matches the path expected by the Dockerfile
 *      (COPY --from=frontend-builder /frontend/build ./app/static)
 *   2. proxy rules     — in dev, all /api and /scorecard requests are
 *      forwarded to the FastAPI backend running on port 8000, so the
 *      browser never hits a CORS error during local development
 * ----------------------------------------------------------------- */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // ── Plugins ────────────────────────────────────────────────────
  plugins: [react()],

  // ── Build output ───────────────────────────────────────────────
  build: {
    // Output to 'build/' so the Dockerfile line
    //   COPY --from=frontend-builder /frontend/build ./app/static
    // finds the compiled assets correctly.
    // (Vite's default is 'dist'; we override it here to avoid
    //  changing the Dockerfile.)
    outDir: 'build',

    // Warn when any individual chunk exceeds 500 kB after gzip.
    // Useful signal if a lazy-import opportunity is being missed.
    chunkSizeWarningLimit: 500,
  },

  // ── Dev server ─────────────────────────────────────────────────
  server: {
    port: 5173,

    // Proxy API requests to the local FastAPI backend.
    // Without this, the browser would block cross-origin requests
    // (localhost:5173 → localhost:8000) during development.
    proxy: {
      // All /api/* calls (contact form, etc.) → FastAPI
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,   // rewrites the Host header to match the target
        secure: false,        // allow HTTP in local dev
      },

      // Scorecard submit endpoint lives outside /api prefix
      '/scorecard': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})