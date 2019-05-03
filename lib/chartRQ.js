const pRequest = require("./pRequest");
var requestor = require("./req");
var request = require('request');

const requestURL = "http://api.trkd.thomsonreuters.com/api/Charts/Charts.svc/REST/Charts_1/GetChart_2";

const equityRequestFields = "CF_LAST:CF_HIGH:CF_LOW:CF_BID:CF_ASK:BID:BID_1:ASK:ASK_1:CF_YIELD:CF_SOURCE:CF_SRC_PAGE:CF_LOTSIZE:CF_DATE:CF_TIME:CF_TICK:CF_NETCHNG:CF_EXCHNG:CF_VOLUME:CF_CLOSE:CF_OPEN:CF_NAME:CF_CURRENCY";
var requestBody2 = {"RetrieveItem_Request_3":{"TrimResponse":false,"ItemRequest":
[{"Fields":"BID:ASK:CF_NAME:LIST_DATE:CONTR_MNTH:EXPIR_DATE","RequestKey":
[{"Name":"LCOc1","NameType":"RIC","Scope":"List"}]}]}};

console.log("Starting chartRQ");

exports.getChart = function(ric, token, appID, startTime, endTime, cWidth, cHeight){
  console.log("getter");
  //return "TOMTOM" + ric + startTime + "  "+ cWidth;



  if(!global.token){

      return Promise.reject("Unable to get quotes, Authorization token not available");


  }else {
    console.log(ric);
    console.log("starting get CHART!");
    console.log("TOKEN", token);

    const chartMsg = {
       "GetChart_Request_2": {
        "chartRequest": {
         "TimeSeries": {
          "TimeSeriesRequest_typehint": [ "TimeSeriesRequest" ],
          "TimeSeriesRequest": [{
              "Symbol": ric,
              "Reference": "d1"
          }]
         },
         "Analyses": {
          "Analysis_typehint": [ "Analysis", "Analysis" ],
          "Analysis": [{
              "Reference": "a1",
              "OHLC": {"Instrument1": {"Reference": "d1"}}
             },
             {
              "Reference": "a2",
              "Vol": {"Instrument1": {"Reference": "d1"}}
             }]
         },
         "StandardTemplate": {
          "Title": {
             "Caption": {"Visible": true, "Customized": false},
             "Range": {"Visible": true}
          },
          "Legend": {"Visible": true, "Information": "Long", "Layout": "MultiLine", "Position": "Overlaid"},
          "Instrument": "Symbol",
          "Delimiter": "%",
          "GridLines": "None",
          "YAxisMarkers": "None",
          "Interval": {"CommonType": "Days", "Multiplier": "1"},
          "ShowNonTradedPeriods": false,
          "ShowHolidays": false,
          "ShowGaps": true,
          "XAxis": {
             "Visible": true,
             "Position": "Bottom",
             "Range": {
              "Fixed": {
               "First": startTime,
               "Last": endTime
              }
             }
          },
          "Subchart": [
             {
              "Weight": 5.0,
              "YAxis": [
               {
                "Visible": true,
                "Position": "Right",
                "Invert": false,
                "Logarithmic": false,
                "Display": {"Mode": "Automatic"},
                "Range": {"Automatic": ""},
                "Analysis": [{"Reference": "a1"}]
               }
              ]
             },
             {
              "Weight": 2.0,
              "YAxis": [
               {
                "Visible": true,
                "Position": "Right",
                "Invert": false,
                "Logarithmic": false,
                "Display": {"Mode": "Automatic"},
                "Range": {"Automatic": ""},
                "Analysis": [{"Reference": "a2"}]
               }
              ]
             }
          ],
          "YAxisTitles": "All",
          "Brand": "None"
         },
         "Scheme": {
          "Background": {
             "BackgroundMode": "Solid",
             "StartColor": {"Named": "Black"},
             "EndColor": {"Named": "White"},
             "HatchStyle": "LargeGrid",
             "GradientMode": "ForwardDiagonal",
             "ImageMode": "Centered"
          },
          "Border": {
             "Color": {"RGB": "139;139;155"},
             "DashStyle": "Solid",
             "Width": 1.0
          },
          "GridLines": {
             "Color": {"RGB": "139;139;155"},
             "DashStyle": "Dot",
             "Width": 1.0
          },
          "Title": {
             "Caption": {
              "Color": {"Named": "Gold"},
              "Family": "Arial",
              "Style": "Bold",
              "Size": 12.0
             },
             "Range": {
              "Color": {"Named": "Gold"},
              "Family": "Arial",
              "Style": "Regular",
              "Size": 8.25
             }
          },
          "Legend": {
             "Color": {"Named": "Gold"},
             "Family": "Arial",
             "Style": "Regular",
             "Size": 8.25
          },
          "XAxis": {
             "Major": {
              "Color": {"Named": "Gold"},
              "Family": "Arial",
              "Style": "Bold",
              "Size": 9.75
             },
             "Minor": {
              "Color": {"Named": "Gold"},
              "Family": "Arial",
              "Style": "Regular",
              "Size": 8.25
             }
          },
          "YAxis": {
             "Major": {
              "Color": {"Named": "Gold"},
              "Family": "Arial",
              "Style": "Bold",
              "Size": 9.75
             },
             "Minor": {
              "Color": {"Named": "Gold"},
              "Family": "Arial",
              "Style": "Regular",
              "Size": 8.25
             },
             "Title": {
              "Color": {"Named": "Gold"},
              "Family": "Arial",
              "Style": "Regular",
              "Size": 8.25
             }
          },
          "Series": [
             {
              "Color": {"Named": "Gold"},
              "DashStyle": "Solid",
              "Width": 0.0,
              "FillColor": {"Named": "Gold"},
              "FillStyle": "Percent20"
             },
             {
              "Color": {"Named": "Red"},
              "DashStyle": "Solid",
              "Width": 0.0,
              "FillColor": {"Named": "Red"},
              "FillStyle": "Percent20"
             },
             {
              "Color": {"RGB": "62;169;0"},
              "DashStyle": "Solid",
              "Width": 0.0,
              "FillColor": {"RGB": "62;169;0"},
              "FillStyle": "Percent20"
             }
          ],
          "LevelLine": [
             {
              "Color": {"RGB": "0;0;153"},
              "DashStyle": "Solid",
              "Width": 1.0
             },
             {
              "Color": {"RGB": "120;120;120"},
              "DashStyle": "Solid",
              "Width": 1.0
             }
          ]
         },
         "ImageType": "PNG",
         "Width": cWidth,
         "Height": cHeight,
         "Culture": "en-US",
         "ReturnPrivateNetworkURL": false
        }
       }
    };

        const opt = {
              url: requestURL,
              headers: {
                "content-type": "application/json;charset=utf-8",
                "X-Trkd-Auth-ApplicationID": appID,
                "X-Trkd-Auth-Token": token
              },
              body: JSON.stringify(chartMsg)
        };



            console.log("return pRequest");

              // return requestor.sendRequest(opt)
              return requestor.sendRequest(opt)
              .then(resp => { return resp.GetChart_Response_2.ChartImageResult.Url; });

}


}

exports.getChart2 = function (ric, startTime, endTime, cWidth, cHeight) {
  console.log("getchart");





};
