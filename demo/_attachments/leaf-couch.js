var dbPath = document.location.protocol+"//"+document.location.host+"/"+document.location.pathname.split("/")[1];
var m= L.map('map').setView([39.40, -96.42], 4),
	mq=L.tileLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpeg", {attribution:'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', subdomains:'1234'}).addTo(m),
	h = new L.Hash(m),
	d = new L.Control.Draw().addTo(m),
	pouchLayer = L.geoJson.pouch(dbPath,{pointToLayer:pointToLayer,onEachFeature:popUp,direction:"both"}).addTo(m);
	m.on('drawn', function (e) {
			pouchLayer.addDoc(e.feature, pass);
		});
		

function pointToLayer(f,l){
	if(f.properties.radius){
		return L.circle(l, f.properties.radius);
	}else{
		return L.marker(l);
	}
}
function popUp(f,l){
    var out = [];
    if (f.properties){
        for(var key in f.properties){
            	out.push(key+": "+f.properties[key] + " <a href='#' id='key-"+key+"' class='delete-row'>x</a>");
        }
        l.bindPopup("<div class='"+ out.lenghth+"' id='" + f._id+"'>"+out.join("<br />")+"</div><br /><input type='button' value='Add Row' id='addRow'><input type='button' value='delete' id='deleteDoc'>");
    }
}
m.on("popupopen",function(e){
   
    var id = e.popup._source.feature._id;
    eee=id;
    L.DomEvent.addListener(L.DomUtil.get("deleteDoc"),"click",function(click){
        pouchLayer.deleteDoc(id,pass);
    });
    L.DomEvent.addListener(L.DomUtil.get("addRow"),"click",function(click){
        var div =L.DomUtil.get(id);
        var form = L.DomUtil.create("form","row-form");
        form.id="addRowForm";
      var kInput =  L.DomUtil.create("input","k-input");
      kInput.setAttribute("style","width:4em");kInput.setAttribute("placeholder","key");
      
      var vInput =  L.DomUtil.create("input","v-input");
      vInput.setAttribute("style","width:4em");vInput.setAttribute("placeholder","value");
      form.appendChild(kInput);
      form.appendChild(vInput);
      var sub = L.DomUtil.create("input","sub-input");
      sub.setAttribute("type","submit");
      sub.setAttribute("value","save");
      form.appendChild(sub);
      form.onsubmit=function(e){

        var key = e.target[0].value;
        var value = e.target[1].value
        pouchLayer.getDoc(id,function(err,dc){
            dc.properties[key]=value;
            pouchLayer.addDoc(dc,pass);
            })
        return false;
        };
      div.appendChild(form);
      
    });
    $(".delete-row").click(function(e){ //almost did this without jquery
    ee=e;
        var key = e.currentTarget.id.slice(4)
        pouchLayer.getDoc(id,function(err,dc){
            dd=dc;
            delete dc.properties[key]
            pouchLayer.addDoc(dc,pass);
            })
        });
});
function pass(){}
