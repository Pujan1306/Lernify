// When VITE_API_URL is set (e.g. in dev), use it. Otherwise use same-origin ("") so
// the frontend and backend can be served from the same Express server.
export const API_URL = import.meta.env.VITE_API_URL ?? "";
