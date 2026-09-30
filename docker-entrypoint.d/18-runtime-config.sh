#!/bin/sh
# vim:sw=4:ts=4:et
#
# Rewrite public/runtime-config.js so VITE_LANGUAGE takes effect without a rebuild.
# Never fail the entrypoint: nginx can still serve the app with the build-time locale.

ME=$(basename "$0")
config_file=/usr/share/nginx/html/runtime-config.js
default_locale=${VITE_LANGUAGE:-en}
rewrite_tmp=

entrypoint_log() {
    if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
        echo "$@"
    fi
}

cleanup() {
    [ -n "$rewrite_tmp" ] && rm -f "$rewrite_tmp"
}
trap cleanup EXIT

skip() {
    entrypoint_log "$ME: warning: $*"
    exit 0
}

case "$default_locale" in
    [a-z][a-z] | [a-z][a-z]-[A-Z][A-Z]) ;;
    *)
        entrypoint_log "$ME: warning: invalid VITE_LANGUAGE='$default_locale', using en"
        default_locale=en
        ;;
esac

if [ ! -f "$config_file" ]; then
    skip "$config_file not found, skipping locale rewrite"
fi

if [ ! -w "$config_file" ]; then
    skip "$config_file is not writable, skipping locale rewrite"
fi

if ! grep -q -F "__DEFAULT_LOCALE__" "$config_file"; then
    skip "placeholder already replaced in $config_file, skipping"
fi

rewrite_tmp=$(mktemp) || skip "could not create temp file, skipping locale rewrite"

if ! sed "s/__DEFAULT_LOCALE__/$default_locale/" "$config_file" > "$rewrite_tmp"; then
    skip "failed to rewrite $config_file, leaving it alone"
fi

# Overwrite in place: mv needs write access on the parent directory.
if cat "$rewrite_tmp" > "$config_file"; then
    chmod 644 "$config_file" 2>/dev/null || true
    entrypoint_log "$ME: info: default locale set to $default_locale"
else
    skip "could not write $config_file, leaving it alone"
fi

exit 0
