# 🍔 Food View — Food Reels App (MERN)

Zomato/Instagram-reels style app: food partners (restaurants) short food videos upload karte hain, users unhe reels ki tarah scroll karte hain, like aur save karte hain.

## Features
- **User auth**: register / login / logout (JWT in httpOnly cookie, bcrypt password hash)
- **Food partner auth**: alag register / login (business name, contact, phone, address)
- **Upload reel** (partner): backend signature deta hai → video browser se seedha ImageKit par → URL MongoDB me
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
| GET | `/api/food/upload-auth` | partner | ImageKit upload signature |
| POST | `/api/food` | partner | JSON: `name, description, video (URL), videoFileId` |
| GET | `/api/food` | user | reels feed (with `isLiked`, `isSaved`) |
| POST | `/api/food/like` | user | `foodId` (toggle) |
| POST | `/api/food/save` | user | `foodId` (toggle) |
| GET | `/api/food/save` | user | saved reels |
| DELETE | `/api/food/:id` | partner (owner) | |
| GET | `/api/food-partner/:id` | user or partner | profile + reels |

## Frontend routes
`/register`, `/user/register`, `/user/login`, `/food-partner/register`, `/food-partner/login`, `/` (feed), `/saved`, `/food-partner/dashboard`, `/create-food`, `/food-partner/:id`

## Deploy (Vercel Services: frontend + backend ek hi project me)
1. Repo ke root me `vercel.json` hona chahiye (diya hua hai). Push karo.
2. Vercel → New Project → repo import → Application Preset: **Services**.
3. Environment Variables: `MONGO_URI`, `JWT_SECRET`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`.
4. MongoDB Atlas → Network Access → `0.0.0.0/0` allow karo.
5. Deploy. Check: `https://<your-app>.vercel.app/api/health` → `{"status":"ok"}`
