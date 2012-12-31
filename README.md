pouch-leaflet
===
the ability to add a geojson layer to [leaflet](http://leafletjs.com/) that is stored in a [pouchdb](http://pouchdb.com/) you can add it from a remote couchdb that is synced to the local one as conectivity permits, for bonus points and because I'm a massacist, it's written in [CoffeeScript](http://coffeescript.org/)

api
---

```javascript
L.geoJson(localDB, [remoteDB,] [options]);
```


basic idea if you do 

```javascript
var syncLayer = L.geoJson.pouch("idb://LocalDB", "http://samehost.com/someDB").addTo(map)
```
you get an indexedDB layer which keeps synced with a couchDB but with the contents stored locally. 

you can pass an option object if you want with both leaflet geojson options and 2 new ones

first is direction, it defaults to "from" which pulles stuff from the remoteDB to the localDB, you can also do "to" which is the opposite, localDB to remoteDB and "both" which syncs both ways.

other option is "continuous" which defaults to true, if false then will only sync when it's created and you'll have to manually sync it. Use layer.sync() to force a sync.

other option is layer.cancel() which cancels current replication.

ex in code 

this is in JavaScript and just 
```javascript
var layer = L.geoJson.pouch("idb://SomeName", "http://localhost:5984/someDB").addTo(map)
//this will sync from remote to browser, there are local storage limits, you could also just do
var otherLayer = L.geoJson.pouch("http://localhost:5984/someDB").addTo(map)
```
this is coffee script and just syncs from a a remote with no localone, the path is reletive to the document if it's an attachment in a database
```coffeescript
geojsonMarkerOptions = 
    radius: 8
    fillColor: "#ff7800"
    color: "#000"
    weight: 1
    opacity: 1
    fillOpacity: 0.8

layer = new L.GeoJSON.Pouch document.location.protocol+"//"+document.location.host+"/"+document.location.pathname.split("/")[1], 
	pointToLayer : (feature, latlng) ->
        L.circleMarker latlng, geojsonMarkerOptions
    someOther : option

layer.addTo(map)

layer.addDoc GeoJSONfeature
```
the source of the demo is in it's [own repo](https://github.com/calvinmetcalf/leaf-couch)

```bash
cake build
```
build minified version
```bash
cake min
```
