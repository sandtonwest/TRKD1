const pRequest = require("./pRequest");
var requestor = require("./req");
var request = require('request');

const requestURL = "http://api.trkd.thomsonreuters.com/api/Charts/Charts.svc/REST/Charts_1/GetChart_2";




exports.getChart = function(){
  console.log("getter");
  return "TOMTOM";

}
