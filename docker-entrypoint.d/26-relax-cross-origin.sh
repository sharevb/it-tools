#!/bin/sh
# vim:sw=4:ts=4:et
#
# The image sends Cross-Origin-Opener-Policy: same-origin and
# Cross-Origin-Embedder-Policy: require-corp so WebAssembly tools can use
# SharedArrayBuffer. Those headers also block third-party <script> tags
# (Umami Cloud, Plausible Cloud, ...). Operators who inject such a snippet
# via HEADER_INJECT and accept that some WASM tools will stop working can
# set RELAX_CROSS_ORIGIN=true to comment the two add_header lines out.
#
# Runs after 20-envsubst-on-templates.sh so it edits the rendered config.

set -e

ME=$(basename "$0")

entrypoint_log() {
    if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
        echo "$@"
    fi
}

case "${RELAX_CROSS_ORIGIN:-}" in
    1 | true | TRUE | yes | YES) ;;
    *) exit 0 ;;
esac

output_dir="${NGINX_ENVSUBST_OUTPUT_DIR:-/etc/nginx/conf.d}"

[ -d "$output_dir" ] || exit 0

probe="$output_dir/.coop-probe.$$"
if ! (touch "$probe" 2>/dev/null && rm -f "$probe" 2>/dev/null); then
    entrypoint_log "$ME: warning: RELAX_CROSS_ORIGIN is set, but $output_dir is not writable, leaving the config alone"
    exit 0
fi

for conf in "$output_dir"/*.conf; do
    [ -f "$conf" ] || continue
    grep -q -E '^[[:space:]]*add_header[[:space:]]+Cross-Origin-(Opener|Embedder)-Policy' "$conf" || continue

    if sed -i -E 's/^([[:space:]]*)(add_header[[:space:]]+Cross-Origin-(Opener|Embedder)-Policy[[:space:]].*)$/\1# \2  # disabled by RELAX_CROSS_ORIGIN/' "$conf" 2>/dev/null; then
        entrypoint_log "$ME: info: RELAX_CROSS_ORIGIN is set, disabled COOP/COEP in $conf"
    else
        entrypoint_log "$ME: warning: RELAX_CROSS_ORIGIN is set, but can not modify $conf, leaving it alone"
    fi
done

exit 0
