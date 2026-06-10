#!/bin/bash

if [[ "$OSTYPE" == "darwin"* ]]; then
    memory=$(sysctl -n hw.memsize)
    memory=$((memory / 1024 / 1024))
else
    memory=$(awk '/MemTotal/{print $2}' /proc/meminfo)
    memory=$((memory / 1024))
fi

node_options="--max-old-space-size=$((memory - 1024))"

echo "NODE_OPTIONS=$node_options"
export NODE_OPTIONS="$node_options"
