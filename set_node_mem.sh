#!/bin/sh

# This file is sourced from package.json scripts, which run under /bin/sh
# (dash on Debian/Ubuntu), so it has to stay POSIX: no [[ ]] and no $OSTYPE.
#
# Callers that fan out into several node processes can pin the heap with
# NODE_MAX_OLD_SPACE_MB instead of sizing it from the whole machine. Playwright
# workers inherit NODE_OPTIONS, so without that every worker would claim a
# machine-sized heap ceiling.
if [ -n "$NODE_MAX_OLD_SPACE_MB" ]; then
    heap_mb="$NODE_MAX_OLD_SPACE_MB"
elif [ "$(uname)" = "Darwin" ]; then
    total_bytes=$(sysctl -n hw.memsize)
    heap_mb=$((total_bytes / 1024 / 1024 - 1024))
else
    total_kb=$(awk '/MemTotal/{print $2}' /proc/meminfo)
    heap_mb=$((total_kb / 1024 - 1024))
fi

node_options="--max-old-space-size=$heap_mb"

echo "NODE_OPTIONS=$node_options"
export NODE_OPTIONS="$node_options"
