# SkillSync – AI-Powered Peer-to-Peer Learning Platform

MERN stack app with JWT auth, skill matchmaking, onboarding, dashboard, sessions with accept/decline, per-session chat (Socket.IO), AI study plan stub/real (OpenAI), avatar uploads, and simple badges on session completion.

## Prerequisites
- Node.js 18+
- npm 9+

## Quick Start
1. Clone and install
```bash
# from project root
cd server && npm i
cd ../client && npm i
```
2. Configure env
```bash
# server/.env (or copy from .env.example)
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=dev_secret
USE_MEMORY_DB=1
```
3. Run
- Separate terminals:
```bash
# Terminal 1
cd server && npm run dev
# Terminal 2
cd client && npm run dev
```
- Or VS Code tasks: Terminal > Run Task… > dev:all

4. Open
- http://localhost:5173

## Core Flows
- Auth: Register → Login (cookie-based session)
- Onboarding: set teach/learn skills
- Dashboard: edit profile, upload avatar, see matches
- Sessions: request from matches, mentor accepts/declines, chat, mark complete (badges increment)
- AI Study Plan: set `OPENAI_API_KEY` in `server/.env` for real responses; otherwise stub JSON

## API (selected)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- Users: `GET/PUT /api/users/me`, `POST /api/users/me/avatar`
- Match: `GET /api/match/find`
- Sessions: `GET/POST /api/sessions`, `GET /api/sessions/:id`, `POST /api/sessions/:id/{accept|decline|complete}`
- AI: `POST /api/ai/study-plan`

## Notes
- Dev DB defaults to in-memory. To use Mongo, set `MONGODB_URI` in `server/.env`.
- Uploads are served at `/uploads/...`.
- For Vite preview use `CLIENT_URL=http://localhost:4173`.

## Next
- Google OAuth + Calendar
- Certificates (PDF)
- Admin panel & moderation
