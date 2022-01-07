#!/bin/bash

set -eo pipefail

usage() {
  goose -h
  cat <<EOM
Usage: $(basename "$0") <goose_command>


EOM
  exit 1
}

[ "$#" -lt 1 ] && { usage; }

source .env

if [[ -z "$MYSQL_USER" ]]; then
  echo "Environment variables not set. Please check the values within .env."
  exit 1
fi

if ! goose -version; then
  echo "goose not installed. "
  echo "visit https://github.com/pressly/goose for more information"
  exit 1
fi

export CMD=$@

goose --dir "migrations" mysql "root:$MYSQL_PASSWORD@/$MYSQL_DATABASE?parseTime=true" "$@"
