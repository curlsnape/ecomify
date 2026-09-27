# Ecomify — Auth & Product CRUD

A small e-commerce API with JWT access + refresh token authentication, full
Product CRUD, `express-validator` input validation, and a React frontend to
consume it.

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), bcrypt, jsonwebtoken, express-validator
- **Frontend:** React (Vite), react-router-dom, axios

## Project structure

```
backend/
  config/        env config + DB connection
  models/        Mongoose schemas (User, Product)
  middlewares/   authenticate (JWT verification)
  validators/    express-validator chains per resource
  controllers/   route handler logic
  routes/        route definitions
  utils/         token signing / hashing helpers
  app/app.js     express app (middleware + route mounting)
  server.js      entry point

frontend/
  src/
    api/         axios instance (auto access-token refresh) + token store
    context/     AuthContext (login/register/logout/session state)
    components/  Navbar, ProtectedRoute
    pages/       Login, Register, Products, ProductForm
```

## Setup

### Backend

```bash
cd backend
npm install
cp  .env  
npm run dev
```

Runs on `http://localhost:3000` by default.

### Frontend

```bash
cd frontend
npm install
cp  .env 
npm run dev
```

Runs on `http://localhost:5173` by default.

## Auth flow (how the tokens work)

1. **Register** — creates the user, hashes the password with bcrypt, returns
   the user only (no tokens).
2. **Login** — verifies the password, then issues:
   - an **access token** (short-lived, ~15 min) returned in the JSON body —
     the frontend keeps this in memory only, never localStorage.
   - a **refresh token** (7 days) set as an `httpOnly` cookie — never touched
     by frontend JS at all.
   A `sha256` hash of the refresh token is also saved on the user document,
   so it can be revoked server-side.
3. **Every API request** — the frontend attaches `Authorization: Bearer <accessToken>`.
4. **Access token expires** — the frontend's axios interceptor catches the
   401, silently calls `/api/auth/refresh-token` (cookie goes automatically),
   gets a new access token, and retries the original request once.
5. **Refresh** — the backend verifies the cookie's JWT signature *and* checks
   its hash matches what's stored on the user. On success it **rotates**
   both tokens. If the hash doesn't match (a token that was already rotated
   out being replayed), it wipes the session and returns 403 — forcing login.
6. **Logout** — clears the stored hash and the cookie.

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Body | Notes |
|---|---|---|---|---|
| POST | `/register` | Public | `name, email, password, confirmPassword` | 409 on duplicate email |
| POST | `/login` | Public | `email, password` | Returns `accessToken` + sets refresh cookie |
| POST | `/refresh-token` | Requires refresh cookie | — | Returns new `accessToken` |
| POST | `/logout` | Authenticated | — | Clears refresh token + cookie |
| GET | `/me` | Authenticated | — | Returns current user |

### Products — `/api/products`

| Method | Endpoint | Access | Body |
|---|---|---|---|
| POST | `/` | Authenticated | `name, description?, price, stock?` |
| GET | `/` | Public | — (`?page=&limit=` optional) |
| GET | `/:id` | Public | — |
| PUT | `/:id` | Authenticated | any subset of `name, description, price, stock` |
| DELETE | `/:id` | Authenticated | — |

All input is validated with `express-validator`; invalid requests return
`400` with a field-level `errors` array (`{ path, msg }` per field).

## Environment variables

See `backend/.env.example` and `frontend/.env.example`.
