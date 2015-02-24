var expect = require('expect.js'),
     btc = require('../lib/btc-client');

describe("btc client", function() {    
  it("get balance",function*(){
    var res = yield btc.cmd("getbalance");
    expect(res).to.be.a("number");
  });
});
