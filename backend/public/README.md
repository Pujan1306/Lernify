This folder is auto-populated at Docker build time with the built frontend (Vite `dist` output).

Do NOT commit built frontend assets here — the Dockerfile runs `vite build` and copies
`frontend/Lernify/dist/*` into `backend/public/` in a dedicated build stage.
