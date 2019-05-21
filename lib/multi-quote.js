const pRequest = require("./pRequest");
var requestor = require("./req");
var request = require('request');

const requestURL = "https://api.trkd.thomsonreuters.com/api/Quotes/Quotes.svc/REST/Quotes_1/RetrieveItem_3";
const equityRequestFields = "DSPLY_NAME:CF_NAME:CF_LAST:CF_CLOSE:CF_HIGH:CF_LOW:CF_TICK:CURRENCY:CF_BID";
var requestBody2 = {"RetrieveItem_Request_3":{"TrimResponse":false,"ItemRequest":
[{"Fields":"BID:ASK:CF_NAME:LIST_DATE:CONTR_MNTH:EXPIR_DATE","RequestKey":
[{"Name":"LCOc1","NameType":"RIC","Scope":"List"}]}]}};
var requestKey = [
    {
    "Name": "/MAYc1",
    "NameType": "RIC"
    },
    {
    "Name": "/MAWc1",
    "NameType": "RIC"
    },
    {
    "Name": "NCMP.CA",
    "NameType": "RIC"
    },
    {
    "Name": "/SOYc1",
    "NameType": "RIC"
    },
    {
    "Name": "SOSO.NS",
    "NameType": "RIC"
    },

];


var quoteObj = module.exports = {

  requestFields: equityRequestFields,
  getQuoteJSON: function(ric, token, appID){
    if(!token){

        return Promise.reject("Unable to get quotes, Authorization token not available");


    }else {
      console.log(ric);
      console.log("starting get multi quote");

          const quoteMsg = {
            "RetrieveItem_Request_3": {
            "ItemRequest": [
            {
            "Fields": equityRequestFields,
            "RequestKey": requestKey,
            "Scope": "List"
            }
            ],
            "TrimResponse": false,
            "IncludeChildItemQoS": false
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
                    // results = result.RetrieveItem_Response_3.ItemResponse[0].Item[0];
                    results = result.RetrieveItem_Response_3.ItemResponse[0].Item;
                    console.log("ppppPPPPPPPPPPPPPPPPPPPPPPPPPP",typeof results);
                    return results;
                    // return result.RetrieveItem_Response_3.ItemResponse[0].Item[0];

                }
            ).catch((err)=>{
              return Promise.reject("ERROR", err);
            });



    }





}
};
