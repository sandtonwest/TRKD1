const http = require("http");
const fs = require("fs");
const url = require("url");



	var urlData = url.parse("https://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/Anonymous/TokenManagement_1/CreateServiceToken_1", true);
  var ric = urlData.query.ric || "TRI.N";
  console.log(ric);
