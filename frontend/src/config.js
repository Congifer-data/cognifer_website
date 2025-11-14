// frontend/src/config.js
// CRA reads env vars that start with REACT_APP_ at build time.
export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
