pouch-leaflet
===
the ability to add a geojson layer to [leaflet](http://leafletjs.com/) that is stored in a [pouchdb](http://pouchdb.com/) you can add it from a remote couchdb that is synced to the local one as conectivity permits, for bonus points and because I'm a massacist, it's written in [CoffeeScript](http://coffeescript.org/)

basic idea if you do 

```javascript
var syncLayer = L.geojson.pouch("idb://synclayer", "http://samehost.com/someDB", {leaflet: "options"}).addTo(map)
```
you get
map <-a- indexedDB <-b- couchDB

with a working if your offline and b should be able to resync if you get disconected and then reconnect

if you change the direcection (default is "from") to to e.g.

```javascript
var syncLayer = L.geojson.pouch("idb://synclayer", "http://samehost.com/someDB", {direction: "to"}).addTo(map)
```
you get

map <-a- indexedDB -b-> couchDB

and you can also do direction both

```javascript
var syncLayer = L.geojson.pouch("idb://synclayer", "http://samehost.com/someDB", {direction: "both"}).addTo(map)
```
map <-a- indexedDB <-b-> couchDB

other option is "continuous" which defaults to true, if false then will only sync once

use layer.sync() to force a sync (this will be helpfull if continuous is false)

other option is layer.cancel() which cancells current replication (only useful if continuous is true)

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