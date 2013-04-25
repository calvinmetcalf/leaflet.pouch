leaf-couch
=========
[leaflet](http://leafletjs.com) + [couchdb](http://couchdb.apache.org/)(via [pouchdb](http://pouchdb.com/)) = crazy delicious

in short I'm using couchdb to capture the shapes drawn with leaflet using my [leaflet.pouch plugin](https://github.com/calvinmetcalf/leaflet.pouch)

also includes [leaflet-hash](https://github.com/mlevans/leaflet-hash) and [leaflet.draw](https://github.com/jacobtoye/Leaflet.draw) (actually [my fork](https://github.com/calvinmetcalf/Leaflet.draw) that emits geoJSON), requires [erica](https://github.com/benoitc/erica) to put it into a db, since I can't get the local pouchdb to replicate over, instead we just send it straight there.

if you have erica installed you should be able to go

```shell
cd leaf-couch
erica push http://localhost:5984/leaflet
```

todo
---

- e̶d̶i̶t̶ ̶p̶r̶o̶p̶e̶r̶t̶i̶e̶s̶
- m̶a̶k̶e̶ ̶m̶a̶p̶ ̶o̶f̶ ̶h̶t̶t̶p̶:̶/̶/̶l̶o̶c̶a̶l̶h̶o̶s̶t̶:̶5̶9̶8̶4̶/̶l̶e̶a̶f̶l̶e̶t̶/̶_̶d̶e̶s̶i̶g̶n̶/̶l̶e̶a̶f̶l̶e̶t̶/̶_̶s̶p̶a̶t̶i̶a̶l̶/̶_̶l̶i̶s̶t̶/̶g̶e̶o̶j̶s̶o̶n̶/̶a̶l̶l̶?̶b̶b̶o̶x̶=̶ ̶b̶b̶o̶x̶ ̶w̶h̶i̶c̶h̶ ̶u̶p̶d̶a̶t̶e̶s̶ ̶o̶n̶ ̶m̶o̶v̶e̶/̶z̶o̶o̶m̶
- authentication
- f̶i̶g̶u̶r̶e̶ ̶o̶u̶t̶ ̶h̶o̶w̶ ̶t̶h̶e̶ ̶h̶e̶l̶l̶ ̶r̶e̶p̶l̶i̶c̶a̶t̶i̶o̶n̶ ̶w̶o̶r̶k̶s̶ ̶i̶n̶ ̶p̶o̶u̶c̶h̶d̶b̶,̶ ̶c̶u̶r̶r̶e̶n̶t̶l̶y̶ ̶i̶t̶s̶ ̶j̶u̶s̶t̶ ̶g̶o̶i̶n̶g̶ ̶s̶t̶r̶a̶i̶t̶ ̶t̶o̶ ̶t̶h̶e̶ ̶c̶o̶u̶c̶h̶ ̶i̶n̶s̶t̶e̶a̶d̶ ̶o̶f̶ ̶u̶s̶i̶n̶g̶ ̶a̶ ̶l̶o̶c̶a̶l̶ ̶i̶d̶b̶:̶/̶/̶ ̶v̶e̶r̶s̶i̶o̶n̶ ̶w̶h̶i̶c̶h̶ ̶r̶e̶p̶l̶i̶c̶a̶t̶e̶s̶ ̶t̶o̶ ̶w̶e̶b̶ ̶o̶n̶e̶
- less bad dom stuff, especially in the popups