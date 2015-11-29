set -eu

SRC="$1"
GITSHA="$(git log -n 1 | head -n 1 | sed 's/commit //' | head -c 8)"
DEST=${2:-$GITSHA}
mkdir -p out/$DEST/img
node index.js "$SRC" "$DEST" | tee out/$DEST/$(basename $1).log