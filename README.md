pouch-leaflet
===
the ability to add a geojson layer to [leaflet](http://leafletjs.com/) that is stored in a [pouchdb](http://pouchdb.com/) you can add it from a remote couchdb that is synced to the local one as conectivity permits, for bonus points and because I'm a massacist, it's written in [CoffeeScript](http://coffeescript.org/)

usage
```coffeescript
geojsonMarkerOptions = 
    radius: 8
    fillColor: "#ff7800"
    color: "#000"
    weight: 1
    opacity: 1
    fillOpacity: 0.8

layer = new L.GeoJSON.Pouch "idb://SomeName", 
	pointToLayer : (feature, latlng) ->
        L.circleMarker latlng, geojsonMarkerOptions
    someOther : option

layer.addTo(map)

layer.addDoc GeoJSONfeature
```
or
```javascript
var layer = L.geojson.pouch("idb://SomeName", "http://localhost:5984/someDB").addTo(map)
//this will sync from remote to browser, there are local storage limits, you could also just do
var otherLayer = L.geojson.pouch("http://localhost:5984/someDB").addTo(map)
```
very rought hold tight for demos and stuff, build with

```bash
cake build
```