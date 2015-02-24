var mongo         = require('co-mongo'),
    co            = require('co'),
    conf          = require('config');

var db = null;

exports.getDb = function*() {
  if(db){
    return db;
  }
  else{
    db = yield mongo.connect(conf.get("db.mongodb"));
    return db;
  }
};

exports.close = function*(){
  if(db){
    yield db.close();
    db = null;
  }
};
