#!/bin/sh
# vim:sw=4:ts=4:et
#
# nginx.conf listens on both IPv4 and IPv6. On a host or container runtime with
# IPv6 disabled, nginx refuses to start:
#
#   socket() [::]:8080 failed (97: Address family not supported by protocol)
#
# Drop the IPv6 listen directives in that case. This runs after
# 20-envsubst-on-templates.sh so it edits the rendered config, and it is a
# no-op wherever IPv6 is available, which is the case the image already
# handles today.

set -e

ME=$(basename "$0")

entrypoint_log() {
    if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
        echo "$@"
    fi
}

# Same check the stock 10-listen-on-ipv6-by-default.sh uses.
if [ -f "/proc/net/if_inet6" ]; then
    exit 0
fi

output_dir="${NGINX_ENVSUBST_OUTPUT_DIR:-/etc/nginx/conf.d}"

[ -d "$output_dir" ] || exit 0

# `sed -i` rewrites through a temporary file in the directory, so the directory
# has to be writable, not only the file. Probe it with a real write, the same
# way 19-skip-envsubst-if-readonly.envsh does.
probe="$output_dir/.ipv6-probe.$$"
if ! (touch "$probe" 2>/dev/null && rm -f "$probe" 2>/dev/null); then
    entrypoint_log "$ME: info: ipv6 not available, but $output_dir is not writable (read-only file system?), leaving the config alone"
    exit 0
fi

for conf in "$output_dir"/*.conf; do
    [ -f "$conf" ] || continue
    grep -q -E '^[[:space:]]*listen[[:space:]]+\[::\]' "$conf" || continue

    # An individual file can still be mounted read-only inside a writable
    # directory, so a failed edit must not take the entrypoint down with it.
    if sed -i -E 's/^([[:space:]]*)(listen[[:space:]]+\[::\].*)$/\1# \2  # disabled by '"$ME"': no IPv6 on this host/' "$conf" 2>/dev/null; then
        entrypoint_log "$ME: info: ipv6 not available, disabled IPv6 listen in $conf"
    else
        entrypoint_log "$ME: info: ipv6 not available, but can not modify $conf, leaving it alone"
    fi
done

exit 0
