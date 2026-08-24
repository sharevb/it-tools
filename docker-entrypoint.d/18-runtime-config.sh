#!/bin/sh

set -eu

config_file=/usr/share/nginx/html/runtime-config.js
default_locale=${VITE_LANGUAGE:-en}

case "$default_locale" in
    [a-z][a-z] | [a-z][a-z]-[A-Z][A-Z]) ;;
    *)
        echo "18-runtime-config.sh: warning: invalid VITE_LANGUAGE='$default_locale', using en" >&2
        default_locale=en
        ;;
esac

if [ -w "$config_file" ]; then
    sed "s/__DEFAULT_LOCALE__/$default_locale/" "$config_file" > "$config_file.tmp"
    mv "$config_file.tmp" "$config_file"
fi
