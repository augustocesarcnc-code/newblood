#!/usr/bin/env bash
set -e
cd -- "$(dirname -- "$0")"
if ! command -v node >/dev/null 2>&1; then
 echo 'Instale Node.js 24.19 ou mais recente em https://nodejs.org/'
 exit 1
fi
exec node jogar.mjs "$@"
