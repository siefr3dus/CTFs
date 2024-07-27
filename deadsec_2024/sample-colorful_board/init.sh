#!/usr/bin/env bash
set -eux
cd /app

(
	mkdir -p /db
	while true
	do
		mongod --dbpath=/db
	done
) &

while sleep 1
do
	if [ "$(mongosh --eval 'db.serverStatus().ok')" = "1" ]
	then
		break
	fi
done
mongosh /init-data.js

node dist/main
