var express = require('express');
var router = express.Router();
const quoteWidget = require("../lib/multi-quote");
//const quoteWidget = require("../lib/trkd-quote");

const TokenEvent = require("../lib/tokenEvent_controller");

  var token_1;
  var appId;

TokenEvent.on("getTokenSuccess", function(token, appid){

  token_1 = token;
  appId = appid;




});


/* GET users listing. */
router.get('/multi-quote/:ric', function(req, res, next) {

  console.log(req.params.ric);





console.log("7777777777777", req.url, appId);

  // var ric = "BTC=";

  var ric = (req.params.ric).toUpperCase();

  console.log("RIC ooooooooo ",ric);


  var getQuoteDiv = function(ric, token, appID){
    console.log("quotediv");
    // setTimeout(quoteWidget.getQuoteJSON(ric), 1500)
    var data1 = [];
    return quoteWidget.getQuoteJSON(ric, token, appID)
    .then(
      function(result){
        console.log("99999999999999999", result);
        console.log(typeof result[0]);
        console.log(result.length);
        var fields1 = [];
        var fullData = [];
        let i;
        for(i= 0; i <result.length; i++){
          // console.log("result length", result.length);
          console.log("I AM! ",i);
          // console.log("| I Expect twice   | ",result[i].Fields.Field);
          if(result[i].Fields){
            fields1.push(result[i].Fields.Field);

          }
          

          console.log("dot name",fields1[0]);










/*
          var data ={
            BID: getField("CF_BID"),
            ASK: getField("CF_ASK"),
            NAME: getField("CF_NAME"),
            F_COLOR: function(){
              if(getField("BID_1") > getField("CF_BID")){
                return "#f32836";

              }else if(getField("BID_1") < getField("CF_BID")){
                return "#94D600";
              }else{
                return "#ffce00";
              }
            },
            CF_TIME: getField("CF_TIME")
          };

          */

          // fullData.push(data);


        };

        let j;
        for(j = 0; j < fields1.length; j++){
          var fields = fields1[j];
          const getField = function(fName){
            for(let idx in fields) {
              if(fields[idx].Name === fName)	{
                const dType = fields[idx].DataType;
                return fields[idx][dType];
              }
            };
          };

          var data =  {
            Name : getField("DSPLY_NAME"),
            Close : getField("CF_CLOSE"),
            High: getField("CF_HIGH"),
            Last: getField("CF_LAST"),
            Tick: getField("CF_TICK"),
            Currency: getField("CURRENCY"),
            Bid: getField("CF_BID")
          };
          data1.push(data);


          console.log("NAMEEEEEEEEEEEEEEEEEEEEEEE",data1);


        }

        return "DONE BOSS";




        console.log("MADANTIN!!!!!!!!!!!!!!!!!!@",data["F_COLOR"]());
        // res.render("quote", {BID: data["BID"],ASK: data["ASK"], color: data["F_COLOR"], CF_TIME: data["CF_TIME"]});
        // res.send({BID: data["BID"],ASK: data["ASK"], color: data["F_COLOR"], CF_TIME: data["CF_TIME"]});
        // res.json({NAME: getField("DSPLY_NAME"), BID: getField("CF_CLOSE") ,ASK: data["ASK"], color: data["F_COLOR"](), CF_TIME: data["CF_TIME"]});
        // res.status





        //res.end();
        // res.send(`<!DOCTYPE html><html><head><style>#container{width:270px; heigth: 90px; border: 1px solid #000;
         // background-color: #2fff2f; overflow: hidden; border-radius: 2px; color: #fefdfb;}</style><title>BANGER!</title></head><body><div id="container"><h1>Price: ${data["BID"]} ${data["ASK"]}</h1></div></body></html>`);
        //res.render("index");




        //return data;
      }
    )
    .then(result3 =>{
      console.log(result3);
      if(data1){
        res.json({full: data1});
        delete data1;
        data1 = null;
        console.log("data uninit", data1);
      }

    })
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

      // res.render("quote", {BID: "DOWN",ASK: "DOWN", color: data["F_COLOR"], CF_TIME: "DOWN"});
      // res.send("something went wrong");
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
