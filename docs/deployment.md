# Deployment

## Development

1. Install MongoDB locally or run `docker compose up mongo`.
2. Copy `.env.example` to `.env`.
3. `npm install`
4. `npm run seed`
5. `npm run dev`

Frontend: `http://localhost:5173`  
API: `http://localhost:5000`

## Production build

```bash
npm run build
```

- Backend emits `backend/dist`
- Frontend emits `frontend/dist`

Run API with `NODE_ENV=production npm run start`. Serve `frontend/dist` from nginx or any static host and proxy `/api` and `/uploads` to the API.

## Docker

```bash
docker compose up --build
```

Services:

- `mongo` — MongoDB 7
- `api` — Express API
- `web` — nginx static frontend + reverse proxy

## Environment

Never bake secrets into images. Pass them at runtime. Required production values are listed in `.env.example`.

## Backup

### MongoDB

```bash
mongodump --uri="$MONGODB_URI" --out=/backups/mongo-$(date +%F)
```

Restore:

```bash
mongorestore --uri="$MONGODB_URI" --drop /backups/mongo-YYYY-MM-DD
```

### Media

Copy the `uploads/` directory (or object-storage bucket) together with the database dump. Filenames in MongoDB `media` documents must match stored files.

### Environment

Store `.env` in a secrets manager. Back up separately from source control. Do not commit production secrets.

## Restore procedure

1. Restore MongoDB first.
2. Restore `uploads/` to `UPLOAD_DIR`.
3. Restore environment variables.
4. Start API and confirm `/health`.
5. Confirm admin login and a public page load.
