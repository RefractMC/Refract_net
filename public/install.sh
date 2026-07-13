#!/bin/sh
# Refract installer bootstrap — https://refractmc.net/install.sh
#
# refractmc.net is static GitHub Pages, so unlike installers served by an
# edge worker, the combine step (engine + config) happens here at install
# time instead of server-side. This stub fetches the shared mget engine
# (github.com/modrexio/mget) plus Refract's install.config.json, exports the
# config as the CFG_* variables the engine expects, and hands over.
set -eu

command -v curl >/dev/null 2>&1 || { echo "error: curl is required" >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "error: jq is required (e.g. 'apt install jq' / 'brew install jq')" >&2; exit 1; }

CONFIG_URL="https://raw.githubusercontent.com/RefractMC/Refract_MC/main/install.config.json"
# Latest v1.x.x mget tag: patches/minors flow automatically, a breaking v2
# never arrives without editing this stub. Same convention as GitHub
# Actions' @v4-style pins.
ENGINE_MAJOR="1"

fetch() { curl -fsSL --proto '=https' --proto-redir '=https' --connect-timeout 10 --retry 2 "$1"; }

config=$(fetch "$CONFIG_URL") || { echo "error: failed to fetch install config" >&2; exit 1; }

engine_tag=$(fetch "https://api.github.com/repos/modrexio/mget/tags?per_page=100" \
  | jq -r --arg major "$ENGINE_MAJOR" '
      [.[].name | capture("^v(?<maj>\\d+)\\.(?<min>\\d+)\\.(?<pat>\\d+)$")?
       | select(.maj == $major)
       | {min: (.min | tonumber), pat: (.pat | tonumber), maj: .maj}]
      | sort_by(-.min, -.pat) | first
      | "v\(.maj).\(.min).\(.pat)"')
[ -n "$engine_tag" ] && [ "$engine_tag" != "null" ] \
  || { echo "error: could not resolve an mget v$ENGINE_MAJOR.x.x tag" >&2; exit 1; }

# Field names are written out statically instead of looped from the JSON —
# no dynamic variable names means no eval, so config content can never
# become shell code here (the engine applies the same rule internally).
cfg() { printf '%s' "$config" | jq -r --arg k "$1" '.[$k] // empty'; }

CFG_SCHEMA_VERSION=$(cfg schema_version)
CFG_PROJECT_NAME=$(cfg project_name)
CFG_GITHUB_REPO=$(cfg github_repo)
CFG_MANIFEST_URL=$(cfg manifest_url)
CFG_PUBKEY=$(cfg pubkey)
CFG_MACOS_BUNDLE_NAME=$(cfg macos_bundle_name)
CFG_MACOS_EXECUTABLE_NAME=$(cfg macos_executable_name)
CFG_DEB_PACKAGE_NAME=$(cfg deb_package_name)
CFG_RPM_PACKAGE_NAME=$(cfg rpm_package_name)
CFG_INSTALL_DIR=$(cfg install_dir)
CFG_INSTALL_URL=$(cfg install_url)
export CFG_SCHEMA_VERSION CFG_PROJECT_NAME CFG_GITHUB_REPO CFG_MANIFEST_URL \
  CFG_PUBKEY CFG_MACOS_BUNDLE_NAME CFG_MACOS_EXECUTABLE_NAME \
  CFG_DEB_PACKAGE_NAME CFG_RPM_PACKAGE_NAME CFG_INSTALL_DIR CFG_INSTALL_URL

engine=$(fetch "https://raw.githubusercontent.com/modrexio/mget/$engine_tag/install.sh") \
  || { echo "error: failed to fetch the mget engine ($engine_tag)" >&2; exit 1; }

printf '%s' "$engine" | sh -s -- "$@"
