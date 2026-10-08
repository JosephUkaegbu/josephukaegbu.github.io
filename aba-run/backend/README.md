# ABA RUN Backend

PostgreSQL-backed API for ABA RUN.

## Local DEV

1. Create a PostgreSQL database named `aba_run`.
2. Run `database/schema.sql`.
3. Run `database/seed.sql`.
4. Copy `.env.example` to `.env` and set `DATABASE_URL`.
5. From this directory run `npm install`.
6. Run `npm run dev`.

Health check: `GET /health`

API:
- `GET /api/config`
- `GET /api/radio/stations`
- `GET /api/billboards?zone=Ariaria`
- `GET /api/missions`
- `GET /api/leaderboard?limit=20`
- `POST /api/players`
- `POST /api/runs`

## STAGING

Use a separate PostgreSQL database and separate `DATABASE_URL`. Never point staging at production.

Recommended environment variables:
`NODE_ENV=staging`
`DATABASE_URL=<staging-postgres-url>`
`CORS_ORIGINS=<staging-game-url>`

## Production

Use another database and credentials. Do not commit `.env`.

The API intentionally keeps radio streams and billboard campaigns in PostgreSQL so content can be changed without rebuilding the game.
