# Architecture

Remit2Nepal is a modular remittance-company platform with a public CMS-driven website and a permissioned admin panel. Backend and frontend are separate packages that communicate over versioned REST APIs (`/api/v1`).

## System context

```text
Browser (public site / admin)
        |
        | HTTPS + httpOnly cookies
        v
   Express API (Node.js)
        |
        +-- MongoDB (system of record)
        +-- Local/object file storage (media, documents)
        +-- NRB Forex API adapter (isolated)
        +-- Scheduler (rate sync)
```

## Design principles

- One file, one responsibility.
- Controllers are thin HTTP adapters.
- Domain rules live in services.
- External systems are isolated behind adapters.
- Financial records are never silently overwritten.
- Secrets never leave the backend.

## Backend layers

| Layer | Responsibility |
| --- | --- |
| `routes/` | Path mounting, middleware wiring |
| `validators/` | Request schema (Zod) |
| `controllers/` | Parse request, call service, format response |
| `services/` | Business rules, transactions, audit |
| `models/` | Persistence schema and indexes |
| `integrations/nrb/` | Official NRB fetch/parse/normalize only |
| `jobs/` | Scheduled work |
| `middlewares/` | Auth, RBAC, rate limit, errors |
| `config/` | Environment, logger, CORS |

## Domain modules

- Identity: users, roles, permissions, sessions, first-login password change
- CMS: settings, navigation, pages, sections, about, team, SEO
- Operations: services, branches, partners, documents, gallery, FAQ, news
- Exchange: currencies, current rates, history, company overrides
- NRB: provider adapter, sync log, retry, stale-rate handling
- Communications: contact inbox, media library
- Governance: audit log, maintenance mode, dashboard analytics

## Exchange-rate data flow

```text
NRBExchangeRateProvider  ->  ExchangeRateSyncService  ->  ExchangeRateService
                                      |                         |
                                      v                         v
                               NRBSyncLog              ExchangeRate + History
```

Public APIs never call the NRB adapter. They read stored rates only. If NRB is unavailable, last valid rates remain.

## Frontend structure

- Public app: CMS-rendered marketing/information pages
- Admin app: isolated layout, RBAC-filtered navigation
- Shared API client, auth session, query cache
- Route-level code splitting

## Security boundaries

- Public APIs are read-only except contact submission.
- Admin APIs require JWT cookie + permission.
- File uploads are type/size validated independently of client MIME.
- Sensitive documents stay private unless marked public.
- Maintenance mode blocks public pages, not admin.
