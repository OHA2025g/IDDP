# Champions of Change - Aspirational Districts Programme

A government analytics dashboard combining elements from Champions of Change and IDD-MH platforms.

## Prerequisites

- Node.js 18+ and Yarn
- Python 3.9+
- MongoDB (optional - only needed if using backend APIs)

## Quick Start (Frontend Only)

```bash
cd frontend
yarn install
yarn start
```

The app will open at http://localhost:3000

## Full Stack Setup

### 1. Start MongoDB (if not running)
```bash
mongod --dbpath /path/to/data
```

### 2. Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Start Frontend
```bash
cd frontend
yarn install
yarn start
```

## Project Structure

```
├── frontend/          # React frontend
│   ├── src/
│   │   ├── App.js     # Main application
│   │   ├── App.css    # Custom styles
│   │   └── index.css  # Global styles + Tailwind
│   └── package.json
├── backend/           # FastAPI backend
│   ├── server.py      # API server
│   └── requirements.txt
└── README.md
```

## Features

- Scrolling ticker bar with real-time alerts
- NITI Aayog branded header
- Hero section with gradient background and image carousel
- Composite Score dashboard (77.03%)
- Actions Requiring Attention cards
- Dashboard Modules (Finance, Economic, Sectorial, etc.)
- Sector Performance cards (Health, Education, Agriculture, Finance, Infrastructure)
- System status footer with data sources

## Tech Stack

- **Frontend**: React, Tailwind CSS, Shadcn/UI, Lucide Icons
- **Backend**: FastAPI, Motor (MongoDB async driver)
- **Database**: MongoDB

## Design

- Teal/cyan gradient hero background
- Government blue/green color scheme
- Uniform card sizing across all sections
- 90% scaled layout for compact view
- Dark footer with matching body background

## Deploy with Easypanel

Use the separate Dockerfiles for backend and frontend.

### Backend

- **Build context:** `backend/` (use `backend` as root in Easypanel).
- **Port:** 8001.
- **Env (required):** `MONGO_URL`, `DB_NAME` (and any other vars your app needs from `.env`).

```bash
# Local build
docker build -t iddp-backend ./backend
docker run -p 8001:8001 -e MONGO_URL=... -e DB_NAME=... iddp-backend
```

### Frontend

- **Build context:** `frontend/` (use `frontend` as root in Easypanel).
- **Port:** 80.
- **Optional build arg:** `REACT_APP_BACKEND_URL` — set to your backend URL (e.g. `https://api.yourdomain.com`) so the app can call the API.

```bash
# Local build (backend URL baked in at build time)
docker build -t iddp-frontend --build-arg REACT_APP_BACKEND_URL=https://api.yourdomain.com ./frontend
docker run -p 3000:80 iddp-frontend
```

In Easypanel: create two apps (backend + frontend), set build context to `backend` and `frontend` respectively, add a MongoDB service for the backend, and wire env vars as above.

## License

© NITI Aayog, Government of India
