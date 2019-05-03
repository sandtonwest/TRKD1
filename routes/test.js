var express = require('express');
var router = express.Router();
const quoteWidget = require("../lib/trkd-q");
//const quoteWidget = require("../lib/trkd-quote");

router.get('/:ric',
  function(req, res, next) {
    // Check active session, i.e.,
    // Make sure the request has cookies associated with a valid user session
    // Check if the user has administrator privileges
    console.log(req.url);
    return next();
  }, function(req, res, next){
    console.log("second", req.url);

    console.log("another one");




  console.log("7777777777777", req.url);

    var ric = "BTC=";
    console.log("RIC ooooooooo ",ric);

    var getQuoteDiv = function(ric){
      console.log("quotediv");



      return quoteWidget.getQuoteJSON(ric)
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
          res.render("quote", {BID: data["BID"],ASK: data["ASK"], color: data["F_COLOR"], CF_TIME: data["CF_TIME"]});
          data = null;
          return next();


          // res.send(`<!DOCTYPE html><html><head><style>#container{width:270px; heigth: 90px; border: 1px solid #000;
           // background-color: #2fff2f; overflow: hidden; border-radius: 2px; color: #fefdfb;}</style><title>BANGER!</title></head><body><div id="container"><h1>Price: ${data["BID"]} ${data["ASK"]}</h1></div></body></html>`);





          //return data;
        }
      )
      .catch(function(error){
        console.log("+++++++++9999999999999999+++++++++++", error);
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
        //return data;
        return next();


      })



  }

  try{
      getQuoteDiv(ric);

  }catch(e){
    throw e;
  }

    // return next();
  }, function(req, res) {
    // Render the information with proper templates
    // Finish response with a proper status
    // res.end();
    // console.log("DATAAAAAAAAAAAAAA", data["BID"]);
 })


















module.exports = router;
