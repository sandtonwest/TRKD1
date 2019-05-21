const pRequest = require("./pRequest");
var requestor = require("./req");
var request = require('request');

// const requestURL = "https://api.trkd.thomsonreuters.com/api/Quotes/Quotes.svc/REST/Quotes_1/RetrieveItem_3";
const requestURL = "http://api.trkd.thomsonreuters.com/api/TimeSeries/TimeSeries.svc/REST/TimeSeries_1/GetInterdayTimeSeries_4"
const equityRequestFields = "CF_LAST:CF_HIGH:CF_LOW:CF_BID:CF_ASK:BID:BID_1:ASK:ASK_1:CF_YIELD:CF_SOURCE:CF_SRC_PAGE:CF_LOTSIZE:CF_DATE:CF_TIME:CF_TICK:CF_NETCHNG:CF_EXCHNG:CF_VOLUME:CF_CLOSE:CF_OPEN:CF_NAME:CF_CURRENCY";
var ricList = ["IBM.N","EUR=","ZAR="];





var reqObj = module.exports = {


  getTimeseriesJSON: function(ric, token, appID, startTime, endTime){


    if(!token){

        return Promise.reject("Unable to get quotes, Authorization token not available");


    }else {

      console.log("starting get timeseries with RIC!!!!!!!!!!!!!!!!!!!", ric);

          const reqMsg = {
            "GetInterdayTimeSeries_Request_4": {
            "Symbol": ric,
            "StartTime": startTime,
            "EndTime": endTime,
            "Interval": "DAILY",
            "Field": [
              "BID",
              "ASK",
              "OPEN",
              "CLOSE",
              "VOLUME"
              ]
            }
          };


          		const opt = {
          			url: requestURL,


          			headers: {
          				"content-type": "application/json;charset=utf-8",
          				"X-Trkd-Auth-ApplicationID": appID,
          				"X-Trkd-Auth-Token": token
          			},
          			body: JSON.stringify(reqMsg)
          		};

              console.log("return pRequest");
              //console.log(opt);
              var reqResult = requestor.sendRequest(opt);

              var results = {};
              //return results;



                // return requestor.sendRequest(opt)
                return requestor.sendRequest(opt)
                .then(function(result){
                  const timeseries = result.GetInterdayTimeSeries_Response_4;

                  console.log("SCODE!!!!!!!!", timeseries);

                  if(!timeseries)
                    throw `Request failed, status code: ${timeseries} - might be empty`;
                  else
                    results = result.GetInterdayTimeSeries_Response_4;
                    console.log(typeof results);
                    return results;
                    // return result.RetrieveItem_Response_3.ItemResponse[0].Item[0];

                }

              //}
            ).catch((err)=>{
              // console.log("CATCH THIS",err);
              return Promise.reject(err);


            });









    }




  }


};
