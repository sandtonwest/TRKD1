const request = require("request");


// wrap the requests module in a promise
exports.sendRequest = function (httpOptions){
  return new Promise(function(resolve, reject){
    // console.log("TT- send request");
    //setTimeout(reqStart(), 1500);
    //setInterval(() => {}, 1000);
    request.post(httpOptions, function(error, res, body){
      if(!error && res.statusCode == 200){
        resolve(JSON.parse(body));
      }else{

        if(error){
          reject(error);
        }else if(body){
          reject(body)

        }else if(res.errno){
          reject("ERROR details : ", res.errno);
        }else{


        try{
          reject(`Request failed, status code: ${res.statusCode} - ${res.statusMessage}`);

        }catch(e){
          reject(`Request failed, error : ${e}` );


        }
      }
    }

    });

  });

};
