fs = require 'fs'
coffee = require 'coffee-script'

task 'build', 'build it', () ->
	fs.readFile './src/pouch.leaflet.coffee', 'utf8', (e,d)->
		unless e
			fs.writeFile './dist/pouch.leaflet.js', coffee.compile d
			console.log "compliled"