#!/usr/bin/env bash
# One loadtest scenario: starts the server, runs bots (processes of 50), prints a summary, stops everything.
# Usage: loadtest/run.sh <players-per-hall> <halls> [duration-s=40] [tick-hz=15]
set -u
PER=$1; HALLS=$2; DUR=${3:-40}; TICK=${4:-15}
OUT=${OUT:-/tmp/connecta-loadtest}; mkdir -p "$OUT"; rm -f "$OUT"/*.log
cd "$(dirname "$0")/.."

TICK_HZ=$TICK MAX_CLIENTS=5000 STATS=1 npx tsx src/index.ts > "$OUT/server.log" 2>&1 &
SERVER=$!
sleep 4
for h in $(seq 1 "$HALLS"); do
  for o in $(seq 0 50 $((PER - 1))); do
    n=$(( PER - o < 50 ? PER - o : 50 ))
    npx tsx loadtest/bots.ts --clients "$n" --offset "$o" --event "event-$h" --duration "$DUR" > "$OUT/bots-$h-$o.log" 2>&1 &
  done
done
sleep $((DUR / 2))
MACHINE=$(top -l 2 -n 0 -s 3 | grep "CPU usage" | tail -1 | sed 's/.*, \([0-9.]*\)% idle/\1/')
sleep $((DUR / 2 + 12))
kill $SERVER 2>/dev/null; pkill -f "src/index.ts" 2>/dev/null; wait 2>/dev/null

# Steady state = skip the first 2 report lines (joining) of every bot process / server sample
down=$(grep -h "down" "$OUT"/bots-*.log | awk -F'down |KB' 'NR>0{print $2}' | awk '{s+=$1;n++} END {printf "%.1f", s/n}')
rtt99=$(grep -h "p99" "$OUT"/bots-*.log | sed 's/.*p99 \([0-9]*\) ms.*/\1/' | sort -n | tail -1)
corr=$(grep -h "corrections" "$OUT"/bots-*.log | sed 's/.*corrections \([0-9]*\).*/\1/' | sort -n | tail -1)
joined=$(grep -h "joined" "$OUT"/bots-*.log | wc -l | tr -d ' ')
failed=$(grep -lh "Error" "$OUT"/bots-*.log 2>/dev/null | wc -l | tr -d ' ')
cpu=$(grep "\[stats\]" "$OUT/server.log" | tail -n +3 | sed 's/.*cpu \([0-9.]*\)%.*/\1/' | sort -n | tail -1)
rss=$(grep "\[stats\]" "$OUT/server.log" | sed 's/.*rss \([0-9]*\) MB.*/\1/' | sort -n | tail -1)
loop=$(grep "\[stats\]" "$OUT/server.log" | tail -n +3 | sed 's/.*p99 \([0-9.]*\) ms.*/\1/' | sort -n | tail -1)
rooms=$(grep "\[stats\]" "$OUT/server.log" | sed 's/.*rooms \([0-9]*\).*/\1/' | sort -n | tail -1)
rej=$(grep "\[stats\]" "$OUT/server.log" | tail -1 | sed 's/.*rejected/rejected/')
echo "halls $HALLS × $PER @ ${TICK}Hz | rooms $rooms | bot procs ok $joined fail $failed | down/client ${down} KB/s | server cpu max ${cpu}% | rss max ${rss} MB | loop p99 max ${loop} ms | rtt p99 max ${rtt99} ms | corrections ${corr} | $rej | machine idle ${MACHINE}%"
