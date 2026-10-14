#!/usr/bin/env bash
# LiveKit media loadtest (LiveKit from ../docker-compose.yml must be running).
# Usage: ./run.sh <rooms> <video-pubs> <audio-pubs> <subs> [duration-s=40] [resolution=high]
# Each room gets the given publishers/subscribers; every subscriber receives every track in its room
# (LAYOUT=3x3 default · lk's "speaker" layout subscribes to at most 6 tracks).
# Needs the LiveKit CLI `lk` (https://github.com/livekit/livekit-cli/releases) on PATH or in $LK.
set -u
ROOMS=$1; VP=$2; AP=$3; SUBS=$4; DUR=${5:-40}; RES=${6:-high}
LK=${LK:-lk}; LAYOUT=${LAYOUT:-3x3}; OUT=${OUT:-/tmp/connecta-media}; mkdir -p "$OUT"; rm -f "$OUT"/*.log
CONTAINER=$(docker ps --filter name=livekit --format '{{.Names}}' | head -1)

bytes() { # "23.2MB / 1.2GB" -> output bytes (second value)
  docker stats --no-stream --format '{{.NetIO}}' "$CONTAINER" | awk -F' / ' '{print $2}' | awk '
    { v=$0; u=v; gsub(/[0-9.]/,"",u); gsub(/[A-Za-z]/,"",v);
      m=1; if(u=="kB")m=1e3; if(u=="MB")m=1e6; if(u=="GB")m=1e9; printf "%d", v*m }'
}

# Fresh LiveKit per run so memory/rooms from the previous run don't leak into the numbers
docker restart "$CONTAINER" > /dev/null; sleep 3

for r in $(seq 1 "$ROOMS"); do
  "$LK" perf load-test --dev --room "lt-$r-$RANDOM" --video-publishers "$VP" --audio-publishers "$AP" \
    --subscribers "$SUBS" --video-resolution "$RES" --duration "${DUR}s" --num-per-second 10 --layout "$LAYOUT" > "$OUT/room-$r.log" 2>&1 &
done
sleep $((DUR / 2))
cpus=""; b0=$(bytes); t0=$(date +%s)
for i in 1 2 3 4; do cpus="$cpus $(docker stats --no-stream --format '{{.CPUPerc}}' "$CONTAINER" | tr -d '%')"; done
b1=$(bytes); t1=$(date +%s)
idle=$(top -l 2 -n 0 -s 2 | grep "CPU usage" | tail -1 | sed 's/.*, \([0-9.]*\)% idle/\1/')
mem=$(docker stats --no-stream --format '{{.MemUsage}}' "$CONTAINER" | awk -F' / ' '{print $1}')
wait

out_mbps=$(echo "$b0 $b1 $t0 $t1" | awk '{printf "%.0f", ($2-$1)*8/($4-$3)/1e6}')
cpu_max=$(echo $cpus | tr ' ' '\n' | sort -n | tail -1)
tracks=$(grep -h "^│ Total" "$OUT"/room-*.log | awk -F'│' '{print $3}' | tr -d ' ' | awk -F/ '{g+=$1;w+=$2} END {print g"/"w}')
loss=$(grep -h "^│ Total" "$OUT"/room-*.log | awk -F'│' '{print $5}' | sed 's/.*(\(.*\)%).*/\1/' | sort -n | tail -1)
errs=$(grep -h "^│ Total" "$OUT"/room-*.log | awk -F'│' '{s+=$6} END {print s+0}')
sub_rate=$(grep -h "^│ Total" "$OUT"/room-*.log | sed 's/.*(\([0-9.]*\)\([km]\)bps avg).*/\1 \2/' | awk '{v=$1; if($2=="m")v*=1000; s+=v; n++} END {printf "%.0f kbps", s/n}')
echo "rooms $ROOMS × (video $VP · audio $AP · subs $SUBS · $RES) | subscribers got tracks $tracks | avg per sub $sub_rate | worst loss ${loss}% | errors $errs | livekit cpu max ${cpu_max}% (100% = 1 core) | mem $mem | server out ~${out_mbps} Mbps | machine idle ${idle}"
