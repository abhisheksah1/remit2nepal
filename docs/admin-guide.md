# Admin guide

## First login

1. Seed the database: `npm run seed`
2. Open `/admin/login`
3. Sign in with the User ID and password from environment variables (`DEFAULT_SUPER_ADMIN_USER_ID`, `DEFAULT_SUPER_ADMIN_PASSWORD`)
4. Change the password immediately. The seed account is created with `mustChangePassword = true`.

Use User ID, not email, as the login identifier.

## Roles

- **SUPER_ADMIN** — all modules, including creating and deactivating admins
- **ADMIN** — only assigned permissions

Sidebar items hide automatically when a permission is missing.

## Website CMS

Homepage sections can be enabled, reordered, and edited. Navigation items can be turned off without deleting them. Header/footer contact details live in Settings.

## Exchange rates

- Current Rates shows NRB and company rates
- Rate History is append-only
- NRB Sync fetches the official Nepal Rastra Bank Forex API
- If NRB is down, last stored rates remain and a failure is logged
- Manual company rates require a reason and create history + audit records

## Documents

Only documents marked public appear on the website. Licenses and internal files stay in the admin unless you explicitly publish them.

## Maintenance mode

Settings → Maintenance Mode shows a public maintenance page. `/admin` remains available.
