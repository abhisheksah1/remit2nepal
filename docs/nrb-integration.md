# NRB Integration

## Official source

Nepal Rastra Bank publishes a documented Forex API:

- Documentation: https://www.nrb.org.np/api-docs-v1/
- Base URL: `https://www.nrb.org.np/api/forex/v1/`
- Endpoint: `GET /rates`

Verified on 2 September 2026 against the live API.

## Request

```text
GET https://www.nrb.org.np/api/forex/v1/rates
  ?page=1
  &per_page=1
  &from=YYYY-MM-DD
  &to=YYYY-MM-DD
```

All four query parameters are required. `per_page` max is 100.

## Verified payload shape

Successful responses use `status.code = 200`. Each payload item contains:

```json
{
  "date": "2026-09-02",
  "published_on": "2026-09-02 00:00:40",
  "modified_on": "2026-09-01 16:07:55",
  "rates": [
    {
      "currency": {
        "iso3": "USD",
        "name": "U.S. Dollar",
        "unit": 1
      },
      "buy": "151.63",
      "sell": "152.23"
    }
  ]
}
```

Notes:

- Live field name is `iso3` (documentation historically showed `ISO3`). The adapter accepts both.
- Buy/sell values are strings and must be parsed to numbers.
- Units may be 1, 10, or 100 (INR, JPY, KRW).

## Isolation

Only `backend/src/integrations/nrb/` talks to NRB.

- `nrb.types.ts` — response contracts
- `nrb.parser.ts` — validation and normalization
- `nrb.client.ts` — HTTP fetch, timeout, retries
- `nrb.provider.ts` — adapter implementing `ExchangeRateProvider`

The rest of the application depends on the provider interface, not NRB HTTP details.

## Failure policy

If NRB is unreachable or returns invalid data:

1. Keep the last successful stored rates.
2. Record a `NRBSyncLog` failure.
3. Retry later according to configured count/timeout.
4. Surface a warning in the admin dashboard.
5. Public pages show last updated time and a stale indicator when data is not freshly synchronized.

## Configuration

Admin can enable/disable integration and automatic fetch. Source URL, timeout, and retry live in settings. Optional `NRB_API_KEY` is server-only and never returned to the frontend.
