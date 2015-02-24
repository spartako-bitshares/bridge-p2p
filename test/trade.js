var expect = require('expect.js'),
     conf  = require('config'),
     trade = require('../lib/trade');

var collection = null;  
var init = function*(){
  yield trade.init();    
  // remove all trades
  collection = yield trade.db.collection(trade.DB_COLLECTION);
  yield collection.remove({});
};

var close = function*(){
  yield collection.remove({});
  yield trade.cleanUp();
  collection = null;
};

describe("Trade", function() {  
  // init trade and remove all obj from db
  before(init);
  
  it("createTrade",function*(){
    var newTrade = {
      btc: {addressIn:"n49xiPH5LS9ntjAfLKrx7BHHyWMTLiESr6",accountOut:""},
      bitBtc : {memoIn:"4-n49xiPH5LS9ntjAfLKrx7BHHyWMTLiESr6",addressOut:""},
      qta : 36000000
    };
    var t = yield trade.createTrade(newTrade);
    // Get trade from db
    var tDb = yield collection.findOne({});
    expect(t).to.eql(tDb);
    // Test fields
    expect(t).to.have.property("_id");
    expect(t.btc).to.eql(newTrade.btc);
    expect(t.bitBtc).to.eql(newTrade.bitBtc);
    expect(t.qta).to.eql(newTrade.qta);
    expect(t.state).to.eql("new");    
    expect(t.dateCreate).to.be.a(Date);
  });

  it("checkTradeBtc true",function*(){
    var t = {
      btc: {addressIn:"n49xiPH5LS9ntjAfLKrx7BHHyWMTLiESr6",accountOut:""},
      bitBtc : {memoIn:"4-n49xiPH5LS9ntjAfLKrx7BHHyWMTLiESr6",addressOut:""},
      qta : 36000000
    };
    var check = yield trade.checkTradeBtc(t);
    expect(check,true);    
  });

  it("checkTradeBtc no qta",function*(){
    var t = {
      btc: {addressIn:"n49xiPH5LS9ntjAfLKrx7BHHyWMTLiESr6",accountOut:""},
      bitBtc : {memoIn:"4-n49xiPH5LS9ntjAfLKrx7BHHyWMTLiESr6",addressOut:""},
      qta : 0
    };
    var check = yield trade.checkTradeBtc(t);
    expect(check,false);    
  });

  it("checkTradeBtc no addressIN",function*(){
    var t = {
      btc: {addressIn:"n49xiPH5LS9ntjAfLKrx7BHHyWMTLiESr7",accountOut:""},
      bitBtc : {memoIn:"4-n49xiPH5LS9ntjAfLKrx7BHHyWMTLiESr6",addressOut:""},
      qta : 36000000
    };
    var check = yield trade.checkTradeBtc(t);
    expect(check,false);    
  });
  
  it("checkTradeBtc addressIN empty",function*(){
    var t = {
      btc: {addressIn:"",accountOut:""},
      bitBtc : {memoIn:"4-n49xiPH5LS9ntjAfLKrx7BHHyWMTLiESr6",addressOut:""},
      qta : 36000000
    };
    var check = yield trade.checkTradeBtc(t);
    expect(check,false);    
  });

  it("checkTradeBitBtc true",function*(){
    var t = {
      btc: {addressIn:"",accountOut:""},
      bitBtc : {memoIn:"",addressOut:""},
      qta : 100000000
    };
    var check = yield trade.checkTradeBitBtc(t);
    expect(check,true);    
  });

  
  after(close);
});


