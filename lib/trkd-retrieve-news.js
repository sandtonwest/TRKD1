const pRequest = require("./pRequest");

const requestURL = "https://api.trkd.thomsonreuters.com/api/News/News.svc/REST/News_1/RetrieveNewsML_1";
// const requestURL = "https://api.trkd.thomsonreuters.com/api/News/RetrieveHeadlineML_1";
const equityRequestFields = "CF_LAST:CF_HIGH:CF_LOW:CF_BID:CF_ASK:CF_YIELD:CF_SOURCE:CF_SRC_PAGE:CF_LOTSIZE:CF_DATE:CF_TIME:CF_TICK:CF_NETCHNG:CF_EXCHNG:CF_VOLUME:CF_CLOSE:CF_OPEN:CF_NAME:CF_CURRENCY";


var newsRetrieve = module.exports = {



	getNewsHeadJSON: (storyID) => {
		if(!global.token)
			return Promise.reject("Unable to get quotes, Authorization token not available");
		console.log("howdy boy");
		const newsMsg = {
      "RetrieveNewsML_Request_1": {
    "NewsMLRequest": {
       "StoryId": [
          storyID
       ]
    }
 }


		};

		const opt = {
			url: requestURL,
			headers: {
				"content-type": "application/json;charset=utf-8",
				"X-Trkd-Auth-ApplicationID": global.applicationID,
				"X-Trkd-Auth-Token": global.token
			},
			body: JSON.stringify(newsMsg)
		};

		return pRequest.sendRequest(opt)
			.then((resp) => {
        // console.log(resp);
				const sCode = resp.RetrieveNewsML_Response_1.NewsMLResponse.Status.StatusCode;
				const sMsg = resp.RetrieveNewsML_Response_1.NewsMLResponse.Status.StatusMsg;

				if(sCode !== 0)
					throw `Request failed, status code: ${sCode} - ${sMsg}`;
				else
					// return resp.RetrieveItem_Response_3.ItemResponse[0].Item[0];
          return resp.RetrieveNewsML_Response_1.NewsMLResponse;
			});
	},


	// send trkd quote request, get a promise back with <html-div> formatted for an equity template based quote message
	getNewsHDiv: (storyID) => {
    console.log("about to get news item");
    console.table(["story id", storyID ]);
		return newsRetrieve.getNewsHeadJSON(storyID)
			.then(newsH => {

        // console.log("q", q);


				return newsH;
			})
			.catch(error => {
        console.log("==>", error);
				return "Error Gettin News STORY";
			});
	}
};
