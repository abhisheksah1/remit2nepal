# Security

## Authentication

- Admin login uses User ID + password (not email-only).
- Passwords are hashed with Argon2.
- Access JWT (15m) and refresh JWT (7d) are httpOnly cookies.
- First login from the seed account forces a password change.
- Failed logins are counted; accounts lock after repeated failures.
- Login endpoints are separately rate limited.

## Authorization

- `SUPER_ADMIN` has all permissions.
- `ADMIN` receives an explicit permission set.
- Every admin route checks authentication then permission.
- Public write endpoints are limited to contact submission.

## HTTP hardening

- Helmet
- CORS allowlist from `CORS_ORIGIN`
- Rate limiting
- HPP
- Cookie `httpOnly`, `sameSite`, `secure` in production
- Central error handler strips stack traces in production

## Input and files

- Zod validation on all mutating endpoints
- Mongo query operators rejected from user objects
- Rich text sanitized with `sanitize-html`
- Uploads validated by extension and magic-byte sniffing
- Size limits enforced
- Stored filenames are generated; original names are metadata only

## Secrets

Never expose to the frontend:

- JWT secrets
- MongoDB URI
- NRB API key
- SMTP / storage credentials
- Admin passwords

`.env.example` contains placeholders only.

## Audit

Sensitive actions write an `AuditLog` with actor, module, entity, old/new values, IP, and user agent. Passwords are never stored in logs.
