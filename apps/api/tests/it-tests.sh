#!/bin/bash
set -e

ARGS=("$@")
if [ ${#ARGS[@]} -eq 0 ]; then
  ARGS=(--project int)
fi

docker-compose up -d --build

until docker-compose exec -T postgres pg_isready -U postgres -d test_db; do
  sleep 1
done

yarn vitest run "${ARGS[@]}"

docker-compose down -v
