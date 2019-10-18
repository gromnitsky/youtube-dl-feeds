.PHONY: server
server: kill
	node server.js &

.PHONY: kill
kill:
	-pkill -f 'node server.js'
