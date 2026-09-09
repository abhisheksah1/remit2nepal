# Database

MongoDB is the system of record. Collections are modeled per domain with indexes on lookup, uniqueness, and admin search fields.

## Collections

| Collection | Purpose |
| --- | --- |
| users | Admin accounts |
| roles | Role definitions |
| permissions | Permission catalog |
| companysettings | Singleton company/site settings |
| pages | CMS pages |
| sections | Homepage and reusable sections |
| services | Remittance services |
| branches | Branch directory |
| partners | Partner logos and profiles |
| currencies | Currency master |
| exchangerates | Current NRB + company rates |
| exchangeratehistories | Immutable rate history |
| nrbsynclogs | Fetch attempts |
| news | News and notices |
| faqs | FAQ entries |
| galleries | Gallery items |
| documents | Licenses and files |
| contactmessages | Private inbox |
| media | Media library |
| seosettings | Global SEO |
| auditlogs | Admin audit trail |
| aboutcompanies | About content |
| teammembers | Leadership |
| navigations | Menu items |
| sociallinks | Social profiles |
| nrbconfigs | Integration settings |

## Important indexes

- `users.userId` unique
- `currencies.code` unique
- `exchangerates.currencyCode` unique
- `exchangeratehistories` unique on `(currencyCode, sourceDate, changeType, sourceHash)`
- `branches` text/search on name, city, district, province
- `news.slug` unique
- `services.slug` unique
- `pages.slug` unique
- `auditlogs` on `createdAt`, `userId`, `module`

## Backup

See `docs/deployment.md` for `mongodump` / `mongorestore` and media copy procedures. Critical data is never stored only in the frontend.
