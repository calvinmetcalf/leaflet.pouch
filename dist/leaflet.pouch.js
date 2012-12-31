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
      pouchParams = L.Util.extend({}, this.defaultParams);
      for (i in opts) {
        if (pouchParams.hasOwnProperty(i)) {
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
                if ("geometry" in doc) {
                  _this.addData(doc);
                }
              } else if (parseInt(doc._rev.slice(0, 1)) > 1) {
                _this.eachLayer(function(f) {
                  if (f.feature._id === doc._id) {
                    return _this.removeLayer(f);
                  }
                });
                if ("geometry" in doc) {
                  if (!doc._deleted) {
                    _this.addData(doc);
                  }
                }
              }
              return true;
            }
          });
          if (remoteDB) {
            return Pouch(remoteDB, function(e2, db2) {
              if (!e2) {
                _this.remoteDB = db2;
                _this.sync = function(cb) {
                  var noOpt, options;
                  options = {
                    continuous: this.pouchParams.continuous
                  };
                  switch (this.pouchParams.direction) {
                    case "from":
                      this._from = this.localDB.replicate.from(this.remoteDB, options);
                      break;
                    case "to":
                      this._to = this.localDB.replicate.to(this.remoteDB, options);
                      break;
                    case "both":
                      this._from = this.localDB.replicate.from(this.remoteDB, options);
                      this._to = this.localDB.replicate.to(this.remoteDB, options);
                      break;
                    default:
                      noOpt = true;
                  }
                  if (cb) {
                    if (!noOpt) {
                      cb(null, true);
                    }
                    if (noOpt) {
                      return cb("No Option");
                    }
                  }
                };
                return _this.sync();
              }
            });
          }
        }
      });
    },
    addDoc: function(doc, cb) {
      if (cb == null) {
        cb = function() {
          return true;
        };
      }
      if ("type" in doc && doc.type === "Feature") {
        if (!("_id" in doc)) {
          return this.localDB.post(doc, cb);
        } else if ("_id" in doc && doc._id.slice(0, 8) !== "_design/") {
          return this.localDB.put(doc, cb);
        }
      } else if ("type" in doc && doc.type === "FeatureCollection") {
        return this.localDB.bulkDocs(doc.features, cb);
      } else if (doc.length) {
        return this.localDB.bulkDocs(doc, cb);
      }
    },
    getDoc: function(doc, cb) {
      if (cb == null) {
        cb = function() {
          return true;
        };
      }
      return this.localDB.get(id, cb);
    },
    deleteDoc: function(id, cb) {
      var _this = this;
      if (cb == null) {
        cb = function() {
          return true;
        };
      }
      return this.getDoc(id, function(err, doc) {
        if (!err) {
          _this.localDB.remove(doc, cb);
        }
        if (err) {
          return cb("err");
        }
      });
    },
    cancel: function(cb) {
      switch (this.pouchParams.direction) {
        case "from":
          this._from.cancel();
          break;
        case "to":
          this._to.cancel();
          break;
        case "both":
          this._from.cancel();
          this._to.cancel();
      }
      return cb(null, true);
    }
  });

  L.geoJson.pouch = function(db, remoteDB, opts) {
    return new L.GeoJSON.Pouch(db, remoteDB, opts);
  };

}).call(this);
