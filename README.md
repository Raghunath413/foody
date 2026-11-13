# 🍔 Food View — Food Reels App (MERN)

Zomato/Instagram-reels style app: food partners (restaurants) short food videos upload karte hain, users unhe reels ki tarah scroll karte hain, like aur save karte hain.

## Features
- **User auth**: register / login / logout (JWT in httpOnly cookie, bcrypt password hash)
- **Food partner auth**: alag register / login (business name, contact, phone, address)
- **Upload reel** (partner): video → Multer (memory) → ImageKit → URL MongoDB me
- **Reels feed** (user): vertical snap-scroll, jo video screen par ho wahi auto-play
- **Like / Save** (toggle) with counts, **Saved** page
- **Partner profile**: total meals, total likes, video grid; owner apne reels delete kar sakta hai

## Folder structure
```
backend/
  server.js
  src/
    app.js
    db/db.js
    models/        user, foodpartner, food, likes, save
    controllers/   auth, food, food-partner
    middlewares/   auth.middleware.js
    routes/        auth, food, food-partner
    services/      storage.service.js (ImageKit)
frontend/          React + Vite
  src/pages/auth, pages/general, pages/food-partner, components, styles
```

## Run locally

### 1. Backend
```bash
cd backend
cp .env.example .env      # apni values bharo
npm install
npm run dev               # http://localhost:3000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:3000
npm install
npm run dev               # http://localhost:5173
```

## API

| Method | Route | Auth | Body |
|---|---|---|---|
| POST | `/api/auth/user/register` | – | `fullName, email, password` |
| POST | `/api/auth/user/login` | – | `email, password` |
| GET | `/api/auth/user/logout` | – | |
| POST | `/api/auth/food-partner/register` | – | `name, contactName, phone, address, email, password` |
| POST | `/api/auth/food-partner/login` | – | `email, password` |
| GET | `/api/auth/food-partner/logout` | – | |
| GET | `/api/auth/me` | – | current role + account |
| POST | `/api/food` | partner | multipart: `name, description, video` |
| GET | `/api/food` | user | reels feed (with `isLiked`, `isSaved`) |
| POST | `/api/food/like` | user | `foodId` (toggle) |
| POST | `/api/food/save` | user | `foodId` (toggle) |
| GET | `/api/food/save` | user | saved reels |
| DELETE | `/api/food/:id` | partner (owner) | |
| GET | `/api/food-partner/:id` | user or partner | profile + reels |

## Frontend routes
`/register`, `/user/register`, `/user/login`, `/food-partner/register`, `/food-partner/login`, `/` (feed), `/saved`, `/food-partner/dashboard`, `/create-food`, `/food-partner/:id`
