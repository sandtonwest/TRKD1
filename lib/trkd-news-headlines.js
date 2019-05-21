const pRequest = require("./pRequest");

const requestURL = "https://api.trkd.thomsonreuters.com/api/News/News.svc/REST/News_1/RetrieveHeadlineML_1";
// const requestURL = "https://api.trkd.thomsonreuters.com/api/News/RetrieveHeadlineML_1";
const equityRequestFields = "CF_LAST:CF_HIGH:CF_LOW:CF_BID:CF_ASK:CF_YIELD:CF_SOURCE:CF_SRC_PAGE:CF_LOTSIZE:CF_DATE:CF_TIME:CF_TICK:CF_NETCHNG:CF_EXCHNG:CF_VOLUME:CF_CLOSE:CF_OPEN:CF_NAME:CF_CURRENCY";


var news_headline = module.exports = {
	requestFields: equityRequestFields,

	// send trkd quote request, get a promise back with a json quote message
	getNewsHeadJSON: (token_1, appId, code) => {
		if(!token_1)
			return Promise.reject("Unable to get quotes, Authorization token not available");

		const newsMsg = {
			"RetrieveHeadlineML_Request_1": {
			"HeadlineMLRequest": {
			"TimeOut": 0,
			"MaxCount": 0,
			"Filter": [
			{
			"FreeTextConstraint": {
			"Value": {
			"Text": code
			}
			}
			},
			{
			"FreeTextConstraint": {
			"Value": {
			"modifier": "not",
			"Text": "*TOP NEWS*"
			}
			}
			},
			{
			"FreeTextConstraint": {
			"Value": {
			"Text": "ZA"
			}
			}
			},
			{
			"MetaDataConstraint": {
			"Value": {
			"Text": "EN"
			},
			"class": "language"
			}
			}
			]
			}
			}
			}

		const opt = {
			url: requestURL,
			headers: {
				"content-type": "application/json;charset=utf-8",
				"X-Trkd-Auth-ApplicationID": appId,
				"X-Trkd-Auth-Token": token_1
			},
			body: JSON.stringify(newsMsg)
		};

		return pRequest.sendRequest(opt)
			.then((resp) => {
        // console.log(resp);
				const sCode = resp.RetrieveHeadlineML_Response_1.HeadlineMLResponse.Status.StatusCode;
				const sMsg = resp.RetrieveHeadlineML_Response_1.HeadlineMLResponse.Status.StatusMsg;

				if(sCode !== 0)
					throw `Request failed, status code: ${sCode} - ${sMsg}`;
				else
					// return resp.RetrieveItem_Response_3.ItemResponse[0].Item[0];
          return resp.RetrieveHeadlineML_Response_1.HeadlineMLResponse.HEADLINEML;
			});
	},


	// send trkd quote request, get a promise back with <html-div> formatted for an equity template based quote message
	getNewsHDiv: (token_1, appId, code) => {
    console.log("about to get headlines");
		return news_headline.getNewsHeadJSON(token_1, appId, code)
			.then(newsH => {
        // console.log("q", q);


				return newsH;
			})
			.catch(error => {
        console.log("==>", error);
				return "Error!";
			});
	}
};
