#!/bin/sh
# Refract installer bootstrap — https://refractmc.net/install.sh
#
# refractmc.net is static GitHub Pages, so the combine step (engine + config)
# happens here at install time instead of server-side: fetch the shared mget
# engine (github.com/modrexio/mget) and Refract's install.config.json, turn
# the config into the CFG_* assignments the engine expects, and hand over.
# Nothing here is evaluated: every value ends up inside a single-quoted
# literal and the engine sets its variables by explicit name.
set -eu

command -v curl >/dev/null 2>&1 || { echo "error: curl is required" >&2; exit 1; }

CONFIG_URL="https://raw.githubusercontent.com/RefractMC/Refract_MC/main/install.config.json"
# Latest v1.x.x mget tag: patches/minors flow automatically, a breaking v2
# never arrives without editing this stub.
ENGINE_MAJOR="1"

fetch() { curl -fsSL --proto '=https' --proto-redir '=https' --connect-timeout 10 --retry 2 "$1"; }

config=$(fetch "$CONFIG_URL") || { echo "error: failed to fetch install config" >&2; exit 1; }

# install.config.json is a flat object of scalars, one "key": value per line,
# with no quotes or backslashes inside values. Any other shape fails here
# instead of being guessed at.
prelude=$(printf '%s\n' "$config" | awk '
  /^[ \t]*[{}][ \t]*,?[ \t]*$/ { next }
  match($0, /^[ \t]*"[a-z][a-z0-9_]*"[ \t]*:[ \t]*/) {
    key = $0; sub(/^[ \t]*"/, "", key); sub(/".*/, "", key)
    val = substr($0, RLENGTH + 1); sub(/[ \t]*,?[ \t]*$/, "", val)
    if (val ~ /^"[^"\\]*"$/ && !index(val, "\047")) val = substr(val, 2, length(val) - 2)
    else if (val !~ /^(true|false|-?[0-9]+)$/) exit 2
    print "CFG_" toupper(key) "=\047" val "\047"; next
  }
  { exit 2 }
') || { echo "error: install config has an unsupported format" >&2; exit 1; }

engine_tag=$(fetch "https://api.github.com/repos/modrexio/mget/tags?per_page=100" \
  | grep -oE "\"name\": *\"v$ENGINE_MAJOR\.[0-9]+\.[0-9]+\"" | sed 's/.*"v/v/; s/"$//' \
  | sort -t. -k2,2n -k3,3n | tail -n 1)
[ -n "$engine_tag" ] || { echo "error: could not resolve an mget v$ENGINE_MAJOR.x.x tag" >&2; exit 1; }

engine=$(fetch "https://raw.githubusercontent.com/modrexio/mget/$engine_tag/install.sh") \
  || { echo "error: failed to fetch the mget engine ($engine_tag)" >&2; exit 1; }

printf '%s\n%s\n' "$prelude" "$engine" | sh -s -- "$@"
