# Remit2Nepal Platform

Production remittance-company website and admin CMS. The public site is fully content-managed. Exchange rates are stored with history and synchronized from the official Nepal Rastra Bank Forex API through an isolated adapter.

## Technology stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, TanStack Query, React Hook Form, Zod
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Argon2, Helmet, Pino
- Integration: Official NRB Forex API `https://www.nrb.org.np/api/forex/v1/rates`

## Installation

```bash
npm install
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
```

Edit `.env` and set a strong `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `DEFAULT_SUPER_ADMIN_PASSWORD`.

## Database setup

Install MongoDB 6+ or start the Compose Mongo service. Default URI: `mongodb://127.0.0.1:27017/remit2nepal`.

## Seed

```bash
npm run seed
```

Idempotent. Creates Super Admin, permissions, roles, currencies, settings, and starter CMS content. It does not overwrite existing production records.

Default login (change immediately):

- User ID: value of `DEFAULT_SUPER_ADMIN_USER_ID` (example: `superadmin`)
- Password: value of `DEFAULT_SUPER_ADMIN_PASSWORD`

## Development

```bash
npm run dev
```

- Public website: http://localhost:5173
- Admin: http://localhost:5173/admin/login
- API: http://localhost:5000/api/v1
- Health: http://localhost:5000/health

## Production build

```bash
npm run build
npm run start
```

Serve `frontend/dist` behind nginx and proxy `/api` and `/uploads` to the API. See `docs/deployment.md`.

## NRB integration

Configured in admin under Exchange Rates → NRB Sync. Source URL defaults to the official NRB Forex API. Failures keep the last successful rates and write a sync log. Details: `docs/nrb-integration.md`.

## Backup and restore

MongoDB dump, `uploads/` copy, and environment backup are documented in `docs/deployment.md`.

## Security

Helmet, CORS allowlist, rate limiting, CSRF on cookie-authenticated mutations, Argon2 passwords, RBAC, upload magic-byte checks, sanitized rich text, and audit logging. Secrets never ship to the frontend. See `docs/security.md`.

## Tests

```bash
npm test
```

## Documentation

- `docs/architecture.md`
- `docs/api.md`
- `docs/database.md`
- `docs/deployment.md`
- `docs/security.md`
- `docs/nrb-integration.md`
- `docs/admin-guide.md`

## Troubleshooting

- **Login fails after seed** — confirm MongoDB is running and `.env` matches the seed command.
- **Rates empty** — run NRB sync from admin or wait for the scheduler. The site still works without live NRB data.
- **CORS errors** — add the frontend origin to `CORS_ORIGIN`.
- **CSRF errors in admin** — ensure cookies are allowed and `X-CSRF-Token` is sent (the SPA does this automatically).
- **Maintenance page on public site** — disable maintenance mode in Settings; `/admin` remains reachable.
