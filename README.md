# BookVerse (MERN)

A social platform for readers to search, preview, and share books.

- Frontend: React + Vite + TailwindCSS + Framer Motion
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT + bcrypt
- Books: Google Books API

## Development

Backend:
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Env
- Backend `.env`: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_BOOKS_API_KEY` (optional), `CORS_ORIGIN`
- Frontend `.env`: `VITE_API_BASE`

## Deploy
- Backend on Render: Web Service, `npm install` + `npm start`, set env vars
- Frontend on Vercel: `npm run build`, output `dist`, set `VITE_API_BASE`
