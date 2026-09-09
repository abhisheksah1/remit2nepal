# API

All application APIs are versioned under `/api/v1`. Responses follow a single envelope.

## Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "buyRate", "message": "Required" }]
}
```

## Public

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/health` | API health |
| GET | `/health` | Process health |
| GET | `/api/v1/public/site` | Settings, nav, SEO, social |
| GET | `/api/v1/public/home` | Homepage payload including rates |
| GET | `/api/v1/public/exchange-rates` | Public rates with stale flag |
| GET | `/api/v1/public/branches` | Searchable branch list |
| GET | `/api/v1/public/services` | Active services |
| GET | `/api/v1/public/news` | Published news/notices |
| GET | `/api/v1/public/faqs` | Active FAQs |
| GET | `/api/v1/public/gallery` | Public gallery |
| GET | `/api/v1/public/documents` | Public documents only |
| GET | `/api/v1/public/partners` | Active partners |
| GET | `/api/v1/public/pages/:slug` | Published CMS page |
| POST | `/api/v1/public/contact` | Contact form |
| GET | `/api/v1/robots.txt` | Robots |
| GET | `/api/v1/sitemap.xml` | Sitemap |

## Auth

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/v1/auth/login` | User ID + password |
| POST | `/api/v1/auth/refresh` | Refresh access cookie |
| POST | `/api/v1/auth/logout` | Revoke refresh token |
| GET | `/api/v1/auth/me` | Current admin |
| POST | `/api/v1/auth/change-password` | Forced/regular password change |

Admin APIs use httpOnly cookies. Mutating calls require `X-CSRF-Token` matching cookie `r2n_csrf`.

## Admin resources

Protected routes:

- `/admins` Super Admin only
- `/dashboard` `/audit-logs` `/settings` `/seo`
- `/exchange-rates` `/nrb`
- `/services` `/branches` `/partners` `/news` `/faqs` `/gallery` `/documents`
- `/pages` `/sections` `/navigation` `/social` `/team` `/about`
- `/contact` `/media`

CRUD uses GET list, GET `/:id`, POST create, PATCH update, DELETE remove.

## Exchange rate extras

- `POST /exchange-rates/company` manual company rate
- `GET /exchange-rates/history`
- `GET /exchange-rates/history/export`
- `GET /exchange-rates/chart`
- `POST /nrb/sync`
- `GET /nrb/config` (never returns API keys)
