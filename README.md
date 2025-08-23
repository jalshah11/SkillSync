# SkillSync – AI-Powered Peer-to-Peer Learning Platform

MERN stack app with JWT auth, skill matchmaking, onboarding, dashboard, sessions with accept/decline, per-session chat (Socket.IO), AI study plan stub/real (OpenAI), avatar uploads, certificates, and badges.

## Prerequisites
- Node.js 18+
- npm 9+

## Quick Start (local)
1. Install
```bash
cd server && npm i
cd ../client && npm i
```
2. Env (server/.env)
```
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=dev_secret
USE_MEMORY_DB=1
```
3. Run
```bash
# Terminal 1
cd server && npm run dev
# Terminal 2
cd client && npm run dev
```
Open http://localhost:5173

## Docker (server + client + Mongo)
```bash
docker compose up --build
```
- Client: http://localhost:8080
- Server: http://localhost:5000
- Update API CORS origin via `CLIENT_URL` in docker-compose.yml if you change ports

## Selected API
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- Users: `GET/PUT /api/users/me`, `POST /api/users/me/avatar`
- Match: `GET /api/match/find`
- Sessions: `GET/POST /api/sessions`, `GET /api/sessions/:id`, `POST /api/sessions/:id/{accept|decline|complete|certificate}`
- AI: `POST /api/ai/study-plan`
- Admin: `GET /api/admin/users`, `GET /api/admin/sessions`, `POST /api/admin/users/:id/toggle-admin`

## Notes
- Dev DB defaults to in-memory; Docker uses Mongo.
- Uploads are served from `/uploads/*`.
- For real OpenAI responses, set `OPENAI_API_KEY` in `server/.env` (local) or as an env var in the server service.

## Next
- Google OAuth + Calendar
- Certificates (PDF)
- Admin panel & moderation
