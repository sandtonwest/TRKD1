var express = require('express');
var router = express.Router();
const timeseries = require("../lib/trkd-timeseries");
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
router.get('/timeseries/:ric', function(req, res, next) {

console.log("TIMESERIES!!!!", req.params.ric);

  // var ric = "BTC=";
  // var ric = (req.params.ric).toUpperCase();
  var ric = req.params.ric;
  console.log("RIC for chart ",ric);

  var getTimeseries = function(ric, token, appID){
    console.log("tiemseries :");
    // setTimeout(quoteWidget.getQuoteJSON(ric), 1500)

        // get chart for last 12 months
    const dtNow = new Date();
    const endTime = dtNow.toISOString();
    console.log("END TIMES!!",endTime);
    dtNow.setFullYear(dtNow.getFullYear() - 1)
    const startTime = dtNow.toISOString();
    const cWidth = 400;
    const cHeight = 300;

    // console.log("TIMES!!",startTime);
    // console.log("TIMES!!",endTime);
    // console.table(["TIMES", endTime, startTime, dtNow.setFullYear(dtNow.getFullYear() - 1)])




    //var xyz = chartWidget.getTimeseries(ric, startTime, endTime, cWidth, cHeight);
    //console.log("print xyz");
    //console.log(xyz);

    //return chartWidget();
    //res.send("done");
    return timeseries.getTimeseriesJSON(ric, token, appID, startTime, endTime, cWidth, cHeight)
    .then(function(dataset){
      console.log("chartURL", dataset);
      //res.end(chartURL);
      // res.render("chart", {chart: chartURL, ric: ric});
      //
      // ric = `/${ric}`;
      // console.table(["target err", ric]);
      res.json(dataset);

    })
    .catch(function(err){

      if(err){
        ric = `/${ric}`;
          console.table(["target err", ric]);
        return timeseries.getTimeseriesJSON(ric, token, appID, startTime, endTime, cWidth, cHeight)
        .then(function(dataset){
          console.log("chartURL", dataset);
          //res.end(chartURL);
          // res.render("chart", {chart: chartURL, ric: ric});
          //
          // ric = `/${ric}`;
          // console.table(["target err", ric]);
          res.json(dataset);

        }).catch((err2)=>{
          res.statusCode = 404;
          res.send(err);

        });
      }

      // res.end(`Received error: ${err}`);

    });

    // .then(chartURL => res.end(chartURL))
    // .catch(err => {
    //   res.statusCode = 404;
    //   res.end(`Received error: ${err}`);
    // });

    //res.send("done");





};

//chartWidget(ric);
getTimeseries(ric, token_1, appId);
})



module.exports = router;
