const pRequest = require("./pRequest");

const requestURL = "https://api.trkd.thomsonreuters.com/api/Quotes/Quotes.svc/REST/Quotes_1/RetrieveItem_3";
const equityRequestFields = "CF_LAST:CF_HIGH:CF_LOW:CF_BID:CF_ASK:CF_YIELD:CF_SOURCE:CF_SRC_PAGE:CF_LOTSIZE:CF_DATE:CF_TIME:CF_TICK:CF_NETCHNG:CF_EXCHNG:CF_VOLUME:CF_CLOSE:CF_OPEN:CF_NAME:CF_CURRENCY";


var quoteObj = module.exports = {
	requestFields: equityRequestFields,

	// send trkd quote request, get a promise back with a json quote message
	getQuoteJSON: (ric) => {
		if(!global.token)
			return Promise.reject("Unable to get quotes, Authorization token not available");
		console.log(ric);
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
				"X-Trkd-Auth-ApplicationID": global.applicationID,
				"X-Trkd-Auth-Token": global.token
			},
			body: JSON.stringify(quoteMsg)
		};

		return pRequest.sendRequest(opt)
			.then((resp) => {
				const sCode = resp.RetrieveItem_Response_3.ItemResponse[0].Item[0].Status.StatusCode;
				const sMsg = resp.RetrieveItem_Response_3.ItemResponse[0].Item[0].Status.StatusMsg;

				if(sCode !== 0)
					throw `Request failed, status code: ${sCode} - ${sMsg}`;
				else
					return resp.RetrieveItem_Response_3.ItemResponse[0].Item[0];
			});
	},


	// send trkd quote request, get a promise back with <html-div> formatted for an equity template based quote message
	getQuoteDiv: (ric, className="quote1") => {
		return quoteObj.getQuoteJSON(ric)
			.then(q => {

				const flds = q.Fields.Field;
				const getField = (fName) => {
					for(let idx in flds) {
						if(flds[idx].Name === fName)	{
							const dType = flds[idx].DataType;
							return flds[idx][dType];
						}
					};
				};

				let divHeader = `<div class="hdr"><span class="lb">${q.RequestKey.Name}</span><span class="vl">${getField("CF_NAME")} (${getField("CF_CURRENCY")})</span></div>`;
				console.log(divHeader);
				let divContent = "";
				q.Fields.Field.forEach(fieldobj => {
					const dType = fieldobj.DataType;
					divContent += `<div class="pt"><span class="lb">${fieldobj.Name.replace("CF_", "")}</span><span class="vl">${fieldobj[dType]}</span></div>`;
				});

				return `<div class="${className}">${divHeader} ${divContent}</div>`;
			})
			.catch(error => {
				return `<div class="${className}"><b>Error: ${error}</b></div>`;
			});
	}
};
