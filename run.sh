set -eu

SRC="$1"
GITSHA="$(git log -n 1 | head -n 1 | sed 's/commit //' | head -c 8)"
PARAM2=${2:-""}
if [ -z "$PARAM2" ]; then
    DEST="out/${PARAM2:-$GITSHA}"
else
    DEST="$PARAM2"
fi
mkdir -p $DEST/img
node index.js "$SRC" "$DEST" | tee $DEST/$(basename $1).log