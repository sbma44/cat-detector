set -eu

SRC="$1"
GITSHA="$(git log -n 1 | head -n 1 | sed 's/commit //' | head -c 8)"
if [ -z "$2" ]; then
    DEST="out/${2:-$GITSHA}"
else
    DEST="$2"
fi
mkdir -p $DEST/img
node index.js "$SRC" "$DEST" | tee $DEST/$(basename $1).log