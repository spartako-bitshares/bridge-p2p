var bitshares = require("bitshares"),
    thunkify = require("thunkify"),
    _ = require("underscore"),
    conf  = require('config')
    co = require("co");

exports.client = null;
exports.init = function*(){
  var opt = conf.bts;
  var client = yield thunkify(bitshares.createClient)(opt.user,opt.pass,opt.host,opt.port);
  _.keys(client).forEach(function(k){
    if(_.isFunction(client[k])){
      client[k] = thunkify(client[k]);
    }
  });
  exports.client = client;
  return client;
};
