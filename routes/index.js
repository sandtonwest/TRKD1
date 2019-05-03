var express = require('express');
var router = express.Router();
const TokenEvent = require("../lib/tokenEvent_controller");

  var token_1;

TokenEvent.on("getTokenSuccess", function(token){

  token_1 = token;




});

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("token_1", token_1);
  res.send(token_1);



  if(typeof token_1 !== "undefined"){


  }
    // res.send('respond with a resource2', token_1);


});




module.exports = router;
