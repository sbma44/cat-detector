SRC="$1"
DEST="$2"
mkdir -p out/$DEST/img
node index.js "$SRC" "$DEST" | tee out/$DEST/$(basename $1).log