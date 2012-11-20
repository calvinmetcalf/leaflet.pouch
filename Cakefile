fs = require 'fs'
coffee = require 'coffee-script'

task 'build', 'build it', () ->
	fs.readFile './src/leaflet.pouch.coffee', 'utf8', (e,d)->
		unless e
			fs.writeFile './dist/pouch.leaflet.js', coffee.compile d
			console.log "compliled"