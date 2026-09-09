#!/usr/bin/env bash
set -euo pipefail
DUMP=${1:?Usage: restore.sh /path/to/mongo-dump-dir}
mongorestore --uri="${MONGODB_URI:?MONGODB_URI required}" --drop "$DUMP"
echo "MongoDB restore complete. Restore media files into UPLOAD_DIR separately."
