const pRequest = require("./pRequest");
var requestor = require("./req");
var request = require('request');

const requestURL = "https://api.trkd.thomsonreuters.com/api/Quotes/Quotes.svc/REST/Quotes_1/RetrieveItem_3";
const equityRequestFields = "CF_LAST:CF_HIGH:CF_LOW:CF_BID:CF_ASK:BID:BID_1:ASK:ASK_1:CF_YIELD:CF_SOURCE:CF_SRC_PAGE:CF_LOTSIZE:CF_DATE:CF_TIME:CF_TICK:CF_NETCHNG:CF_EXCHNG:CF_VOLUME:CF_CLOSE:CF_OPEN:CF_NAME:CF_CURRENCY";
var requestBody2 = {"RetrieveItem_Request_3":{"TrimResponse":false,"ItemRequest":
[{"Fields":"BID:ASK:CF_NAME:LIST_DATE:CONTR_MNTH:EXPIR_DATE","RequestKey":
[{"Name":"LCOc1","NameType":"RIC","Scope":"List"}]}]}};


var quoteObj = module.exports = {

  requestFields: equityRequestFields,
  getQuoteJSON: function(ric, token, appID){
    console.log("QUOTE JSON STARTED%%%%%%%%%%%%%%%%%", ric);
    if(!token){

        return Promise.reject("Unable to get quotes, Authorization token not available");


    }else {
      console.log(ric);
      console.log("starting get quote");

          const quoteMsg = {
            "RetrieveItem_Request_3" : {
              "TrimResponse" : false,
              "ItemRequest" : [{
                  "RequestKey" : [{
                      "Name" : ric,
                      "NameType" : "RIC"
                    }
                  ],
                  "Fields": quoteObj.requestFields,
                  "Scope" : "List",
                  "ProvideChainLinks" : true
                }
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
          			body: JSON.stringify(quoteMsg)
          		};

              console.log("return pRequest");
              //console.log(opt);
              var reqResult = requestor.sendRequest(opt);

              var results = {};
              //return results;



                // return requestor.sendRequest(opt)
                return requestor.sendRequest(opt)
                .then(function(result){
                  console.log("inside THEN");
                  const sCode = result.RetrieveItem_Response_3.ItemResponse[0].Item[0].Status.StatusCode;
                  const sMsg = result.RetrieveItem_Response_3.ItemResponse[0].Item[0].Status.StatusMsg;
                  console.log("SCODE!!!!!!!!", sCode);

                  if(sCode !== 0)
                    throw `Request failed, status code: ${sCode} - ${sMsg}`;
                  else
                    results = result.RetrieveItem_Response_3.ItemResponse[0].Item[0];
                    console.log(typeof results);
                    return results;
                    // return result.RetrieveItem_Response_3.ItemResponse[0].Item[0];

                }
              //function(error){
                //console.log("ERROR");
              //}
            );












              //setTimeout(reqStart(), 1500);

              // request.post(opt, function(err, res, body){
              //   console.log(res.body);
              //   console.log("from call back");
              //   return res.body;
              // });



    }




  }
  // send trkd quote request, get a promise back with <html-div> formatted for an equity template based quote message

};
