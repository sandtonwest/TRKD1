var express = require('express');
var router = express.Router();
const quoteWidget = require("../lib/trkd-q");
//const quoteWidget = require("../lib/trkd-quote");

const TokenEvent = require("../lib/tokenEvent_controller");

  var token_1;
  var appId;

TokenEvent.on("getTokenSuccess", function(token, appid){

  token_1 = token;
  appId = appid;




});


/* GET users listing. */
router.get('/quote/:ric', function(req, res, next) {

  console.log(req.params.ric);





console.log("7777777777777", req.url, appId);

  // var ric = "BTC=";

  var ric = (req.params.ric).toUpperCase();

  console.log("RIC ooooooooo ",ric);

  var getQuoteDiv = function(ric, token, appID){
    console.log("quotediv");
    // setTimeout(quoteWidget.getQuoteJSON(ric), 1500)
    return quoteWidget.getQuoteJSON(ric, token, appID)
    .then(
      function(result){
        // console.log("99999999999999999", result);
        var fields = result.Fields.Field;
        console.log(fields);

        const getField = function(fName){
          for(let idx in fields) {
            if(fields[idx].Name === fName)	{
              const dType = fields[idx].DataType;
              return fields[idx][dType];
            }
          };
        };

        // console.log(getField("CF_NAME"));
        // console.log(getField("CF_BID"));
        // console.log(getField("CF_ASK"));

        var data ={
          BID: getField("CF_BID"),
          ASK: getField("CF_ASK"),
          NAME: getField("CF_NAME"),
          F_COLOR: function(){
            if(getField("BID_1") > getField("CF_BID")){
              return "#f32836"

            }else if(getField("BID_1") < getField("CF_BID")){
              return "#94D600";
            }else{
              return "#ffce00"
            }
          },
          CF_TIME: getField("CF_TIME")
        };

        console.log("MADANTIN!!!!!!!!!!!!!!!!!!@",getField("BID_1"));
        // res.render("quote", {BID: data["BID"],ASK: data["ASK"], color: data["F_COLOR"], CF_TIME: data["CF_TIME"]});
        // res.send({BID: data["BID"],ASK: data["ASK"], color: data["F_COLOR"], CF_TIME: data["CF_TIME"]});
        res.json({BID: data["BID"],ASK: data["ASK"], color: data["F_COLOR"], CF_TIME: data["CF_TIME"]});
        // res.status

        delete data;
        data = null;
        console.log("data uninit", data);
        //res.end();
        // res.send(`<!DOCTYPE html><html><head><style>#container{width:270px; heigth: 90px; border: 1px solid #000;
         // background-color: #2fff2f; overflow: hidden; border-radius: 2px; color: #fefdfb;}</style><title>BANGER!</title></head><body><div id="container"><h1>Price: ${data["BID"]} ${data["ASK"]}</h1></div></body></html>`);
        //res.render("index");




        //return data;
      }
    )
    .catch(function(error){
      console.log("+++++++++9999999999999999+++++++++++", error);
      //if (error.Fault.Code.Subcode.Value === "a:Security_ExpiredToken"){
      if (error.Fault){
        console.log(error.Fault);
        console.log("TOKEN EXPIRED", error.Fault.Code);
        require("./app.js");


      }else if (error["Fault"]){
        console.log("TOKEN EXPIRED2", error["Fault"]["Code"]);
      }

      var data ={
        BID: 0,
        ASK: 0,
        NAME: 0
      };

      var data ={
        BID: 0,
        ASK: 0,
        NAME: 0,
        F_COLOR: "#f32836",
        CF_TIME: 0
      };

      res.render("quote", {BID: "DOWN",ASK: "DOWN", color: data["F_COLOR"], CF_TIME: "DOWN"});
      //res.end();

      return data;
    })



}

try{
    getQuoteDiv(ric, token_1, appId);

}catch(e){
  throw e;
}

var hbs = require("hbs");
console.log("time for hbs");
hbs.registerHelper('link', function(ric) {
  console.log("hbs", ric);
  var data = getQuoteDiv(ric);
  var bid= hbs.escapeExpression(data["BID"]);


  return bid;
});




// setTimeout(getQuoteDiv(ric), 1500);

//var rr = getQuoteDiv(ric);





  //quoteWidget.getQuoteDiv("ZAR=");
  //.then(quoteD => console.log("did it", quoteD) )
  //.catch(err);
  //var testric = quoteWidget.getQuoteDiv("ZAR=")[0];
  //console.log(data);




  // res.send(`<!DOCTYPE html><html><head><style>#container{width:270px; heigth: 90px; border: 1px solid #000;
  // background-color: #2fff2f; overflow: hidden; border-radius: 2px; color: #fefdfb;}</style><title>BANGER!</title></head><body><div id="container"><h1>Price: ${rr}</h1></div></body></html>`);
  //res.render("index");
});




module.exports = router;
