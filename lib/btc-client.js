var bitcoin = require("bitcoin"),
    thunkify = require("thunkify"),
    conf  = require('config'),
    _ = require("underscore"),
    co = require("co");

var client = new bitcoin.Client(_.extend(conf.btc,{timeout: 30000}));

var _cmd = function(){
  return client.cmd.apply(client,arguments);
};
_cmd = thunkify(_cmd);

exports.cmd = function*(){
  var res = yield _cmd.apply(this,arguments);
  return res[0];
};
