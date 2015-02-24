var bitcoin = require("./btc-client"),
    _db = require("../db"),
    _ = require("underscore"),
    _bitshares = require("./bts-client"),
    thunkify = require("thunkify"),
    co = require("co");

var db = null;
var bitshares = null;
var BITBTC_ID = 0; 
var DB_COLLECTION = "trade";

// START and CLOSE
// All methods MUST be called after init() and before cleanUp()
var init = function*(){
  db = yield _db.getDb();
  bitshares = yield _bitshares.init();  
  yield bitshares.wallet_open(["default"]);
  // Uset in test
  module.exports.db = db;
  module.exports.bitshares = bitshares;
  module.exports.BITBTC_ID = BITBTC_ID;
  module.exports.DB_COLLECTION = DB_COLLECTION;
};
module.exports.init = init;

var cleanUp = function*(){
  if(db){
    yield _db.close();
    yield bitshares.wallet_close([]);
    db = null;
    bitshares = null;
    // used in test
    module.exports.db = null;
    module.exports.bitshares = null;
  }
}
module.exports.cleanUp = cleanUp;
//////////////////////////////////////////////////////////////

// Create a new trade:
// bitBtc : {memoIn,addressOut}
// Btc : {addressIn,accountOut}
// SCHEMA: {btc,bitBtc,qta,state,dateCreate}
var createTrade = function*(input){
  var bitBtc = input.bitBtc,
      btc = input.btc,
      qta = input.qta, // int in satoshi
      state = "new", // init state: "new"
      trade = yield db.collection(DB_COLLECTION);
  
  var dateCreate = new Date();
  var newTrade = yield trade.insert({btc:btc,bitBtc:bitBtc,qta:qta,state:state,dateCreate:dateCreate});
  if(newTrade && newTrade.length > 0){
    return newTrade[0];
  }
  else{
    return null;
  }
};
module.exports.createTrade = createTrade;

// Check for the current trade if exists btc transaction and if it is conform to trade
var checkTradeBtc = function*(trade){
  var isOk = false;
  // Get value from btc.addressIn
  try{
    var balance = yield bitcoin.cmd("getreceivedbyaddress",trade.btc.addressIn,1);
  }
  catch(e){ 
    if(e.code === -5){ // address error, no exception -> isOk = false
      isOk = false;
      return isOk;
    }
    else{
      throw e;
    }
  }
  // Multiply by 10^8 -> int
  balance = parseInt(balance*Math.pow(10,8));
  isOk = (balance === trade.qta); // TODO: check if neeed write a delta diff as equal
  return isOk;  
};
module.exports.checkTradeBtc = checkTradeBtc;

// Check for the current trade if exists bitBtc transaction and it is valid w.r.t. trade info
var checkTradeBitBtc = function*(trade,start_block_num){
  start_block_num = start_block_num|| 0;
  var isOk = false;
  // Get transaction lists
  var transactions = yield bitshares.wallet_account_transaction_history(["bridge","DVS"]);
  // Filter with memo
  transactions = transactions.filter(function(t){
    return t.ledger_entries[0].memo === trade.bitBtc.memoIn;
  });
  if(transactions.length == 1){ // should be only one transaction -> otherwise not ok!
    var t = transactions[0];
    isOk = (BITBTC_ID === t.ledger_entries[0].amount.asset_id) &&
           (t.ledger_entries[0].amount.amount === trade.qta);
  }
  return isOk;  
};
module.exports.checkTradeBitBtc = checkTradeBitBtc;

var testCheckTradeBitBtc = function*(){
  yield init();
  
  var trade = {
    btc: {addressIn:"n49xiPH5LS9ntjAfLKrx7BHHyWMTLiESr6",accountOut:""},
    bitBtc : {memoIn:"",addressOut:""},
    qta : 100000000
  };
  var check = yield checkTradeBitBtc(trade);
  console.log(trade,check);
  yield cleanUp();
};
