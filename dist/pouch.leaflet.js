(function() {

  L.GeoJSON.Pouch = L.GeoJSON.extend({
    defaultParams: {
      continuous: true,
      direction: "from"
    },
    initialize: function(db, remoteDB, opts) {
      var i, pouchParams,
        _this = this;
      if (typeof remoteDB === "object") {
        opts = remoteDB;
        remoteDB = void 0;
      }
      this._layers = {};
      pouchParams = L.Util.extend({}, this.defaultAJAXparams);
      for (i in opts) {
        if (this.pouchParams.hasOwnProperty(i)) {
          pouchParams[i] = opts[i];
        }
      }
      this.pouchParams = pouchParams;
      L.Util.setOptions(this, opts);
      return Pouch(db, function(e1, db1) {
        if (!e1) {
          _this.localDB = db1;
          _this.localDB.changes({
            continuous: _this.pouchParams.continuous,
            include_docs: true,
            onChange: function(c) {
              var doc;
              doc = c.doc;
              if (parseInt(doc._rev.slice(0, 1)) === 1) {
                _this.addData(doc);
              } else if (parseInt(doc._rev.slice(0, 1)) > 1) {
                _this.eachLayer(function(f) {
                  if (f.feature._id === doc._id) {
                    return _this.removeLayer(f);
                  }
                });
                if (!doc._deleted) {
                  _this.addData(doc);
                }
              }
              return true;
            }
          });
          if (remoteDB) {
            return Pouch(remoteDB, function(e2, db2) {
              var options;
              if (!e2) {
                _this.remoteDB = db2;
                options = {
                  continuous: _this.pouchParams.continuous
                };
                switch (_this.pouchParams.direction) {
                  case "from":
                    return _this.localDB.replicate.from(_this.remoteDB, options);
                  case "to":
                    return _this.localDB.replicate.to(_this.remoteDB, options);
                  case "both":
                    _this.localDB.replicate.from(_this.remoteDB, options);
                    return _this.localDB.replicate.to(_this.remoteDB, options);
                  default:
                    return console.log("you sure about that?");
                }
              }
            });
          }
        }
      });
    },
    addDoc: function(doc, cb) {
      if ("type" in doc && doc.type === "Feature") {
        this.localDB.post(doc, cb || function() {
          if (!("_id" in doc)) {
            return true;
          }
        });
        return this.localDB.put(doc, cb || function() {
          if ("_id" in doc) {
            return true;
          }
        });
      } else if ("type" in doc && doc.type === "FeatureCollection") {
        return this.localDB.bulkDocs(doc.features, cb || function() {
          return true;
        });
      } else if (doc.length) {
        return this.localDB.bulkDocs(doc, cb || function() {
          return true;
        });
      }
    },
    deleteDoc: function(id) {
      var _this = this;
      return this.localDB.get(id, function(err, doc) {
        return _this.localDB.remove(doc, function() {
          if (!err) {
            return true;
          }
        });
      });
    }
  });

  L.geojson.pouch = function(db, remoteDB, opts) {
    return new L.GeoJSON.Pouch(db, remoteDB, opts);
  };

}).call(this);
