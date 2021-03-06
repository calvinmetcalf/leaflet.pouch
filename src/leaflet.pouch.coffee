L.GeoJSON.Pouch = L.GeoJSON.extend(
	defaultParams:
		continuous: true
		direction: "from"

	initialize: (remoteDB, opts) ->
		@_orig = [remoteDB, opts]
		if typeof remoteDB is "object"
			opts = remoteDB
			remoteDB = undefined
		if remoteDB
			if remoteDB.slice(0,4)!="http"
				db = remoteDB
				remoteDB = undefined
			else if remoteDB.slice(0,4)=="http"
				if opts and opts.idbName
					db = opts.idbName
				else
					parts = remoteDB.split("/")
					db = parts.shift()
					while db == ""
						db = parts.shift()
		else
			if opts and opts.idbName
				db = opts.idbName
			else
				parts = location.pathname.split("/")
				db = parts.shift()
				while db == ""
					db = parts.shift()
		@_layers = {}
		@_dbName=db
		pouchParams = L.Util.extend({}, @defaultParams)
		for i of opts
			pouchParams[i] = opts[i]  if pouchParams.hasOwnProperty(i)
		@pouchParams = pouchParams
		L.Util.setOptions @, opts
		Pouch @_dbName, (e1, db1) =>
			unless e1
				@localDB = db1
				@localDB.changes(
					continuous : @pouchParams.continuous
					include_docs : true
					onChange : (c) =>
						doc = c.doc
						if parseInt(doc._rev.slice(0, 1)) is 1
							@addData doc if "geometry" of doc
						else if parseInt(doc._rev.slice(0, 1)) > 1
							@eachLayer (f) =>
								@removeLayer f  if f.feature._id is doc._id
							
							if "geometry" of doc
								@addData doc  unless doc._deleted
						true			
				)
				if remoteDB
						@remoteDB = remoteDB
						@sync = (cb) ->
							options = continuous : @pouchParams.continuous
							switch @pouchParams.direction
								when "from" then @_from = Pouch.replicate @localDB, @remoteDB, options
								when "to" then @_to = Pouch.replicate @remoteDB, @localDB,  options
								when "both"
									@_from = Pouch.replicate @localDB, @remoteDB, options
									@_to = Pouch.replicate @remoteDB, @localDB,  options
								else noOpt = true
							if cb
								cb(null, true) unless noOpt
								cb("No Option") if noOpt
						@sync()
			else if remoteDB
				Pouch remoteDB, (e3, db3) =>
					unless e3
						@localDB = db3
						@localDB.changes(
							continuous : @pouchParams.continuous
							include_docs : true
							onChange : (c) =>
								doc = c.doc
								if parseInt(doc._rev.slice(0, 1)) is 1
									@addData doc if "geometry" of doc
								else if parseInt(doc._rev.slice(0, 1)) > 1
									@eachLayer (f) =>
										@removeLayer f  if f.feature._id is doc._id
							
									if "geometry" of doc
										@addData doc  unless doc._deleted
								true			
						)
	addDoc: (doc, cb = ()-> true) ->
		if "type" of doc and doc.type == "Feature"
			unless "_id" of doc
				@localDB.post doc, cb
			else if "_id" of doc and doc._id.slice(0,8) != "_design/"
				@localDB.put doc, cb 
		else if "type" of doc and doc.type == "FeatureCollection"
			@localDB.bulkDocs doc.features, cb
		else if doc.length
			@localDB.bulkDocs doc, cb
	getDoc: (id, cb = ()-> true) ->
		@localDB.get id, cb
	
	deleteDoc: (id, cb = ()-> true) ->
		@getDoc id, (err, doc) =>
			@localDB.remove doc, cb unless err
			cb("err") if err

	cancel: (cb) ->
		switch @pouchParams.direction
			when "from" then @_from.cancel()
			when "to" then @_to.cancel()
			when "both"
				@_from.cancel()
				@_to.cancel()
		cb(null, true)
	destroy: (cb=()->true)->
		Pouch.destroy @_dbName,cb
)
L.geoJson.pouch = (remoteDB, opts)->
	new L.GeoJSON.Pouch(remoteDB, opts)