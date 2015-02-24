var expect = require('expect.js'),
     bts = require('../lib/bts-client');

describe("bts client", function() {    
  it("get balance",function*(){
    yield bts.init();
    yield bts.client.wallet_open(["default"]);
    var res = yield bts.client.wallet_account_balance([]);
    // example: [ [ 'bridge', [ [ 0, 100000000 ] ]]]
    expect(res).to.be.an('array');
    expect(res).to.not.be.empty();    
    expect(res[0][0]).to.eql("bridge"); // account name
    expect(res[0][1]).to.be.an('array'); // asset list
    expect(res[0][1]).to.not.be.empty();
    expect(res[0][1][0]).to.be.an('array'); // first assset balance
    expect(res[0][1][0]).to.not.be.empty();
    expect(res[0][1][0][0]).to.be.a('number'); // asset id
    expect(res[0][1][0][1]).to.be.a('number'); // asset qta (in satoshi)
  });
});


