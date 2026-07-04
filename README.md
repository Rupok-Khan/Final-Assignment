# Evently — MERN Event Listing Platform

A responsive event discovery platform with JWT authentication, event search and filtering, saved events, and a creator dashboard.

## Run locally

1. Copy `server/.env.example` to `server/.env` and update `MONGODB_URI` and `JWT_SECRET`.
2. Copy `client/.env.example` to `client/.env` (the default API URL works locally).
3. Install everything: `npm.cmd run install:all` and then `npm.cmd install`.
4. Optional demo data: `npm.cmd run seed`.
5. Start both applications: `npm.cmd run dev`.

Frontend: `http://localhost:5173` · API: `http://localhost:5000/api`

Demo seed login: `demo@evently.com` / `Demo1234`
