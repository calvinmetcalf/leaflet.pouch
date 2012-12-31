L.GeoJSON.Pouch = L.GeoJSON.extend(
	defaultParams:
		continuous: true
		direction: "from"

	initialize: (db, remoteDB, opts) ->
		if typeof remoteDB is "object"
			opts = remoteDB
			remoteDB = undefined
		@_layers = {}
		pouchParams = L.Util.extend({}, @defaultParams)
		for i of opts
			pouchParams[i] = opts[i]  if pouchParams.hasOwnProperty(i)
		@pouchParams = pouchParams
		L.Util.setOptions @, opts
		Pouch db, (e1, db1) =>
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
					Pouch remoteDB, (e2, db2) =>
						unless e2
							@remoteDB = db2
							@sync = (cb) ->
								options = continuous : @pouchParams.continuous
								switch @pouchParams.direction
									when "from" then @_from = @localDB.replicate.from @remoteDB, options
									when "to" then @_to = @localDB.replicate.to @remoteDB, options
									when "both"
										@_from = @localDB.replicate.from @remoteDB, options
										@_to = @localDB.replicate.to @remoteDB, options
									else noOpt = true
								if cb
									cb(null, true) unless noOpt
									cb("No Option") if noOpt
							@sync()	
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
	getDoc: (doc, cb = ()-> true) ->
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
	
)
L.geoJson.pouch = (db, remoteDB, opts)->
	new L.GeoJSON.Pouch(db, remoteDB, opts)