set -eu

GITSHA="$(git log -n 1 | head -n 1 | sed 's/commit //' | head -c 8)"
./run.sh '/Volumes/mapbox/cat photos/123MEDIA/' $GITSHA &
sleep 2
PID="$(ps aux | grep node | grep -v grep | awk '{print $2}')"
echo "PID = $PID"
if [ -z "$PID" ]; then
    echo "process did not launch"
    exit 1
fi

i=0
mkdir -p out/$GITSHA/test
while [ $i -lt 120 ]; do
    ps -p $PID -o %mem=,vsz= >> out/$GITSHA/test/mem.log
    sleep 1
    i=$((i+1))
done

kill -9 $PID