const pRequest = require("./pRequest");

const requestURL = "https://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/Anonymous/TokenManagement_1/CreateServiceToken_1";


// send trkd token authentication request, get a promise back with a token
exports.authenticate = function(userName, password, appid) {
	const authMsg = {
		"CreateServiceToken_Request_1": {
			"ApplicationID": appid,
			"Username": userName,
			"Password": password
		}
	};

	const opt = {
		url: requestURL,
		headers: {
			"content-type": "application/json;charset=utf-8"
		},
		body: JSON.stringify(authMsg)
	};

	return pRequest.sendRequest(opt)
		.then((resp) => {return resp.CreateServiceToken_Response_1.Token})
		.catch((err) => {
				return Promise.reject("ERROR", err);
		});
};
