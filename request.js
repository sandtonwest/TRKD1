var request = require('request');
var fs = require("fs");

var requestBody = {"CreateServiceToken_Request_1":{"ApplicationID":"trkddemoappwm","Username":"trkd-demo-wm@thomsonreuters.com","Password":"x8e4x23oo"}};

//RequestBody body = RequestBody.create(JSON, "{\"RetrieveItem_Request_3\": {\"TrimResponse\": false,\"ItemRequest\": [{\"Fields\": \"BID:ASK:CF_NAME:LIST_DATE:CONTR_MNTH:EXPIR_DATE\",\"RequestKey\": [{\"Name\": \"LCOc1\",\"NameType\": \"RIC\"}],\"Scope\": \"List\"}]}}");

var requestBody2 = {"RetrieveItem_Request_3":{"TrimResponse":false,"ItemRequest":[{"Fields":"BID:ASK:CF_NAME:LIST_DATE:CONTR_MNTH:EXPIR_DATE","RequestKey":[{"Name":"LCOc1","NameType":"RIC","Scope":"List"}]}]}};
var tt = "";


var myJSONObject = { };
request({
    url: "https://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/Anonymous/TokenManagement_1/CreateServiceToken_1",
    method: "POST",
    json: true,   // <--Very important!!!
    body: requestBody
}, function (error, response, body){
    //console.log(response.body);
    console.log(response.socket.authorized);

    console.log(response.socket._secureEstablished);
    console.log(response.body.CreateServiceToken_Response_1.Token);
    var token = response.body.CreateServiceToken_Response_1.Token;
    //console.log(response.authorized);
    if(response.socket.authorized){
      request({
          url: "https://api.trkd.thomsonreuters.com/api/Quotes/Quotes.svc/REST/Quotes_1/RetrieveItem_3",
          method: "POST",
          headers: {"X-Trkd-Auth-ApplicationID" : "trkddemoappwm","Content-type" : "application/json;charset=utf-8", "X-Trkd-Auth-Token": token},
          json: true,   // <--Very important!!!
          body: requestBody2
      }, function(error2, response2, body2){
        console.log(response2.body);
        console.log("BODY.fault", response2.body.Fault.Reason.Text);
        console.log("BODY.fault", response2.body.Fault.Detail.ClientErrorReference);

      });

    }else{
      console.log("NOT AUTHORIZED", response.body);
    }

});
