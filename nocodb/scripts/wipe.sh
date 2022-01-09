#!/bin/bash

set -eo pipefail

echo "cleaning up existing nocodb instances and volume .."

containers=$(docker container ls -a --format "{{.Names}}"  --filter "name=noco")
for container in $containers
do
  echo "removing container: $container"
  docker container stop $container
  docker container rm -f $container
done

docker volume ls --filter "name=nocodb_db_data" -q | xargs -I {} docker volume rm {}

