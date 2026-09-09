#!/usr/bin/env bash
set -euo pipefail
STAMP=$(date +%F-%H%M)
OUT=${1:-./backups}
mkdir -p "$OUT/mongo-$STAMP" "$OUT/uploads-$STAMP"
mongodump --uri="${MONGODB_URI:?MONGODB_URI required}" --out="$OUT/mongo-$STAMP"
if [ -d "${UPLOAD_DIR:-uploads}" ]; then
  cp -R "${UPLOAD_DIR:-uploads}" "$OUT/uploads-$STAMP/"
fi
echo "Backup written to $OUT"
