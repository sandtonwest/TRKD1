const pRequest = require("./pRequest");
var requestor = require("./req");
var request = require('request');

// const requestURL = "https://api.trkd.thomsonreuters.com/api/Quotes/Quotes.svc/REST/Quotes_1/RetrieveItem_3";
const requestURL = "http://api.trkd.thomsonreuters.com/api/QuoteLists/QuoteLists.svc/REST/QuoteLists_1/GetSimpleData_2"
const equityRequestFields = "CF_LAST:CF_HIGH:CF_LOW:CF_BID:CF_ASK:BID:BID_1:ASK:ASK_1:CF_YIELD:CF_SOURCE:CF_SRC_PAGE:CF_LOTSIZE:CF_DATE:CF_TIME:CF_TICK:CF_NETCHNG:CF_EXCHNG:CF_VOLUME:CF_CLOSE:CF_OPEN:CF_NAME:CF_CURRENCY";
var ricList = ["IBM.N","EUR=","ZAR="];



var reqObj = module.exports = {


  getListJSON: function(ric, token, appID){

    if(!token){

        return Promise.reject("Unable to get quotes, Authorization token not available");


    }else {
      ricList.push(ric);
      console.log(ric);
      console.log("starting get quote");

          const reqMsg = {
            "GetSimpleData_Request_2": {
                "RICs": {
                   "RIC": ricList
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
                  const sCode = result.GetSimpleData_Response_2.SimpleDataResult.ItemResponse[0].Item[0].Status.StatusCode;
                  const sMsg = result.GetSimpleData_Response_2.SimpleDataResult.ItemResponse[0].Item[0].Status.StatusMsg;
                  console.log("SCODE!!!!!!!!", sCode);

                  if(sCode !== 0)
                    throw `Request failed, status code: ${sCode} - ${sMsg}`;
                  else
                    results = result.GetSimpleData_Response_2.SimpleDataResult.ItemResponse[0].Item[0];
                    console.log(typeof results);
                    return results;
                    // return result.RetrieveItem_Response_3.ItemResponse[0].Item[0];

                }

              //}
            );








    }




  }
  // send trkd quote request, get a promise back with <html-div> formatted for an equity template based quote message

};
