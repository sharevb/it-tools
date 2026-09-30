#!/bin/sh
# vim:sw=4:ts=4:et
#
# Splice operator-supplied HTML into index.html's <head> at start-up, so a
# self-hosted image can carry an analytics snippet (Umami, Plausible, ...)
# without a rebuild. The marker is a literal `<!-- HEADER_INJECT -->` line in
# the built index.html (see the source index.html).
#
# Sources are concatenated, in this order:
#   HEADER_INJECT          the HTML itself (compose `HEADER_INJECT: |` works;
#                          one value may already contain several tags)
#   HEADER_INJECT_1 .. _30 extra snippets, empty numbers are skipped
#   HEADER_INJECT_FILE     path to a file mounted into the container
#
# Never fail the entrypoint: a missing/unwritable index.html just means the
# snippet is absent, and nginx can still serve the app.

ME=$(basename "$0")
index_file="${HEADER_INJECT_INDEX:-/usr/share/nginx/html/index.html}"
marker='<!-- HEADER_INJECT -->'
inject_tmp=
rewrite_tmp=

entrypoint_log() {
    if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
        echo "$@"
    fi
}

cleanup() {
    if [ -n "$inject_tmp" ]; then
        rm -f "$inject_tmp"
    fi
    if [ -n "$rewrite_tmp" ]; then
        rm -f "$rewrite_tmp"
    fi
}
trap cleanup EXIT

skip() {
    entrypoint_log "$ME: warning: $1"
    exit 0
}

append_snippet() {
    printf '%s\n' "$1" >> "$inject_tmp" || skip "could not write inject buffer, skipping header inject"
}

inject_tmp=$(mktemp) || skip "could not create temp file, skipping header inject"

got=

if [ -n "${HEADER_INJECT:-}" ]; then
    append_snippet "$HEADER_INJECT"
    got=1
fi

i=1
while [ "$i" -le 30 ]; do
    eval "val=\${HEADER_INJECT_${i}:-}"
    if [ -n "$val" ]; then
        append_snippet "$val"
        got=1
    fi
    i=$((i + 1))
done

if [ -n "${HEADER_INJECT_FILE:-}" ]; then
    if [ ! -r "$HEADER_INJECT_FILE" ]; then
        entrypoint_log "$ME: warning: HEADER_INJECT_FILE is not readable: $HEADER_INJECT_FILE, skipping that source"
    else
        cat "$HEADER_INJECT_FILE" >> "$inject_tmp" || skip "could not read HEADER_INJECT_FILE, skipping header inject"
        # Honour a file that does not end with a newline.
        printf '\n' >> "$inject_tmp"
        got=1
    fi
fi

if [ -z "$got" ]; then
    exit 0
fi

if [ ! -f "$index_file" ]; then
    skip "$index_file not found, skipping header inject"
fi

if [ ! -w "$index_file" ]; then
    skip "$index_file is not writable, skipping header inject"
fi

if ! grep -q -F "$marker" "$index_file"; then
    skip "placeholder $marker not found in index.html (already injected at build time?), skipping"
fi

rewrite_tmp=$(mktemp) || skip "could not create temp file, skipping header inject"

if ! awk -v marker="$marker" -v inj="$inject_tmp" '
    index($0, marker) {
        while ((getline line < inj) > 0) print line
        close(inj)
        next
    }
    { print }
' "$index_file" > "$rewrite_tmp"; then
    skip "failed to rewrite $index_file, leaving it alone"
fi

# mktemp is 0600; dist files are 0644 so nginx and helpers can read them.
chmod 644 "$rewrite_tmp" 2>/dev/null || true

# Overwrite in place: mv needs write access on the parent directory, which
# nginx does not have when only index.html is chowned.
if cat "$rewrite_tmp" > "$index_file"; then
    chmod 644 "$index_file" 2>/dev/null || true
    entrypoint_log "$ME: info: injected custom HTML into <head>"
else
    skip "could not write $index_file, leaving it alone"
fi

exit 0
