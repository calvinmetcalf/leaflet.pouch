(function() {

  L.GeoJSON.Pouch = L.GeoJSON.extend({
    defaultParams: {
      continuous: true,
      direction: "from"
    },
    initialize: function(remoteDB, opts) {
      var db, i, parts, pouchParams,
        _this = this;
      this._orig = [remoteDB, opts];
      if (typeof remoteDB === "object") {
        opts = remoteDB;
        remoteDB = void 0;
      }
      if (remoteDB) {
        if (remoteDB.slice(0, 4) !== "http") {
          db = remoteDB;
          remoteDB = void 0;
        } else if (remoteDB.slice(0, 4) === "http") {
          if (opts && opts.idbName) {
            db = opts.idbName;
          } else {
            parts = remoteDB.split("/");
            db = parts.pop();
            while (db === "") {
              db = parts.pop();
            }
          }
        }
      } else {
        if (opts && opts.idbName) {
          db = opts.idbName;
        } else {
          parts = location.href.split("/");
          db = parts.pop();
          while (db === "") {
            db = parts.pop();
          }
        }
      }
      this._layers = {};
      this._dbName = db;
      pouchParams = L.Util.extend({}, this.defaultParams);
      for (i in opts) {
        if (pouchParams.hasOwnProperty(i)) {
          pouchParams[i] = opts[i];
        }
      }
      this.pouchParams = pouchParams;
      L.Util.setOptions(this, opts);
      return Pouch(this._dbName, function(e1, db1) {
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
            _this.remoteDB = remoteDB;
            _this.sync = function(cb) {
              var noOpt, options;
              options = {
                continuous: this.pouchParams.continuous
              };
              switch (this.pouchParams.direction) {
                case "from":
                  this._from = Pouch.replicate(this.localDB, this.remoteDB, options);
                  break;
                case "to":
                  this._to = Pouch.replicate(this.remoteDB, this.localDB, options);
                  break;
                case "both":
                  this._from = Pouch.replicate(this.localDB, this.remoteDB, options);
                  this._to = Pouch.replicate(this.remoteDB, this.localDB, options);
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
        } else if (remoteDB) {
          return Pouch(remoteDB, function(e3, db3) {
            if (!e3) {
              _this.localDB = db3;
              return _this.localDB.changes({
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
            }
          });
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
    getDoc: function(id, cb) {
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
    },
    destroy: function(cb) {
      if (cb == null) {
        cb = function() {
          return true;
        };
      }
      return Pouch.destroy(this._dbName, cb);
    }
  });

  L.geoJson.pouch = function(remoteDB, opts) {
    return new L.GeoJSON.Pouch(remoteDB, opts);
  };

}).call(this);
