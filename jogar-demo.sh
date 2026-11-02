#!/usr/bin/env bash
set -e
cd -- "$(dirname -- "$0")"
exec node jogar.mjs --demo "$@"
