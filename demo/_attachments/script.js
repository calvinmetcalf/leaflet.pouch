var m = L.map('map').setView([42.3336, -71.0966], 13),
	attributionText = 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', 
	mq=L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpeg', {attribution : attributionText, subdomains : '1234'}).addTo(m);
var dbPath = document.location.protocol+"//"+document.location.host+"/"+document.location.pathname.split("/")[1];

var pouchLayer = L.geoJson.pouch("idb://leaf-pouch", dbPath, {onEachFeature : popUp}).addTo(m);

function popUp(f,l){
    var out = [];
    if (f.properties){
        for(var key in f.properties){
             out.push(key+": "+f.properties[key]);
        }
        l.bindPopup(out.join("<br />"))
    }
};
