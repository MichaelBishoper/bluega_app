This project expects the frontend to know where the backend is served.

- Copy `.env.example` to `.env` or `.env.local` in the `frontend/` folder.
- Edit `REACT_APP_API_URL` to point to your teammate's backend host and port (e.g. `http://localhost:8081`).
- Restart the dev server after changing env values.

Notes:
- Do not commit `.env` with personal machine-specific values. Commit only `.env.example`.
- The backend `musicplayer/.env` is only used by the Spring Boot server and is not read by the browser.
