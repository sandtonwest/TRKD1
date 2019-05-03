var express = require('express');
var router = express.Router();
const chartWidget = require("../lib/chartRQ");
//const chartWidget = require("../lib/cht");
//const quoteWidget = require("../lib/trkd-quote");

const TokenEvent = require("../lib/tokenEvent_controller");

  var token_1;
  var appId;

TokenEvent.on("getTokenSuccess", function(token, appid){

  token_1 = token;
  appId = appid;




});


/* GET users listing. */
router.get('/chart/:ric', function(req, res, next) {

console.log("7777777777777", req.params.ric);

  // var ric = "BTC=";
  var ric = (req.params.ric).toUpperCase();
  console.log("RIC for chart ",ric);

  var getChart = function(ric, token, appID){
    console.log("chartWidget :");
    // setTimeout(quoteWidget.getQuoteJSON(ric), 1500)

        // get chart for last 12 months
    const dtNow = new Date();
    const endTime = dtNow.toISOString();
    dtNow.setFullYear(dtNow.getFullYear() - 1)
    const startTime = dtNow.toISOString();
    const cWidth = 400;
    const cHeight = 300;

    console.log(startTime);


    console.log("BEFORE");

    //var xyz = chartWidget.getChart(ric, startTime, endTime, cWidth, cHeight);
    //console.log("print xyz");
    //console.log(xyz);

    //return chartWidget();
    //res.send("done");
    return chartWidget.getChart(ric, token, appID, startTime, endTime, cWidth, cHeight)
    .then(function(chartURL){
      console.log("chartURL", chartURL);
      //res.end(chartURL);
      res.render("chart", {chart: chartURL, ric: ric});

    })
    .catch(function(err){
      res.statusCode = 404;
      res.end(`Received error: ${err}`);

    });

    // .then(chartURL => res.end(chartURL))
    // .catch(err => {
    //   res.statusCode = 404;
    //   res.end(`Received error: ${err}`);
    // });

    //res.send("done");





};

//chartWidget(ric);
getChart(ric, token_1, appId);
})



module.exports = router;
