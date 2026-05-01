/* -----------------------------------------------------------------
 * File:    frontend/src/config.js
 * Purpose: Central place for all environment-driven config values
 *
 * Why this file was broken:
 *   The original used process.env.REACT_APP_API_URL which is a
 *   Create React App (CRA) convention. This project uses Vite.
 *   Vite exposes env vars through import.meta.env, and only
 *   variables prefixed with VITE_ are included in the bundle.
 *
 * How to configure per environment:
 *   Development  → create frontend/.env (gitignored) and set:
 *                    VITE_API_URL=http://localhost:8000/api
 *                  (the Vite proxy in vite.config.js also handles
 *                   this automatically, so the variable is optional
 *                   in dev — the fallback below is enough)
 *
 *   Production   → set VITE_API_URL in your Vercel project settings
 *                  under Settings → Environment Variables:
 *                    VITE_API_URL=https://your-app.onrender.com/api
 *
 * Usage in any component or api file:
 *   import { API_BASE } from '../config'
 *   axios.post(`${API_BASE}/contact`, payload)
 * ----------------------------------------------------------------- */

/**
 * Base URL for all backend API calls.
 *
 * In development this resolves to an empty string because the Vite
 * proxy transparently rewrites /api/* → http://localhost:8000/api/*,
 * so relative paths like axios.post('/api/contact') work as-is.
 *
 * In production (Vercel → Render) the full Render URL is required
 * so the browser knows where to send requests.
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? '/api'