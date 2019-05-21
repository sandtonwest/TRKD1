var express = require('express');
var router = express.Router();
const TokenEvent = require("../lib/tokenEvent_controller");
const news_headline = require("../lib/trkd-news-headlines");
const newsRetrieval = require("../lib/trkd-retrieve-news");

  var token_1;

TokenEvent.on("getTokenSuccess", function(token, appid){

  token_1 = token;
  appId = appid;




});

/* GET users listing. */
router.get('/news_H/:code', function(req, res, next) {
  // console.log("token_1", token_1);

  var code = (req.params.code).toUpperCase();
  console.log("GOT CODE!!", code);
    var fullData = [];




  if(typeof token_1 !== "undefined"){


  }
    // res.send('respond with a resource2', token_1);

    var getNewsHead = async function(){
      // console.log("newsHdiv");
      // setTimeout(quoteWidget.getQuoteJSON(ric), 1500)
      // var newsHeadline = await news_headline.getNewsHDiv(token_1, appId, code);

      return news_headline.getNewsHDiv(token_1, appId, code);

    };

  var newsBucket = [];


  var getNewsBody = async function(result){
    let i;
      var newsResult1 = [];
      var items1;
      console.table(["SHOW ME", result.HL.length]);
    for(i = 0; i < result.HL.length; i++ ){
      // console.log("last!!! " ,result.HL[i]);

      // console.log("HT", result.HL[i].HT);


//use headline result to get news body
       items1 = await newsRetrieval.getNewsHDiv(result.HL[i].ID)
      .then(async function(result2){


        // console.table(["items ", result2.Story]);
        var finResult = [];
        console.log("HT TOPIC", result.HL[i].HT);
        newsBucket.push({"topic": result.HL[i].HT, "body":result2.Story});
        newsResult1.push({"topic": result.HL[i].HT, "body":result2.Story});
        finResult.push({"topic": result.HL[i].HT, "body":result2.Story});
        // console.log("nunu size", nunu.length);
        console.log("bucket1", newsBucket.length);


        // console.log(result2);
        // nunu1 = await nunu;

        // return await nunu;
        return await finResult;


      });

    }
    console.log("@@@@@@", items1.length);
    return await newsBucket;

  }



        var news1 = async function(){
          // var rez;

          let fromNewsReq = await getNewsHead();

          if(fromNewsReq){

            let item = await getNewsBody(fromNewsReq);
            console.log("ITEM %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            console.log("REZ1", item.length);
             return await item;

          }else{
            return "EMPTY NEWS DATA";
          }

       };




            // console.log("TANGO", news1().then((msg)=>{console.log(msg.ID)}));
            news1()
            .then((msg1)=>{
              console.log("THENq!!!");
              console.log("~~~~~~~~~~~~tango river delta", msg1.length);

              var newMsg = [];

              for(let i in msg1){

                if(msg1[i].topic){

                  // newsMsg.push(msg1[i].body);
                  const xml2js = require('xml2js');

                  const parser = new xml2js.Parser({ attrkey: "ATTR" });

                  parser.parseString(msg1[i].body, function(error, result) {
                  if(error === null) {
                      if( result.NewsML.NewsItem[0].NewsComponent[0].NewsComponent[0]){
                        // res.send({"fullData": result.NewsML.NewsItem[0].NewsComponent[0]});
                        newMsg.push(result.NewsML.NewsItem[0].NewsComponent[0].NewsComponent[0]);
                        return result.NewsML.NewsItem[0].NewsComponent[0].NewsComponent[0];
                        // newMsg.push(result.NewsML.NewsItem[0].NewsComponent[0].NewsComponent[0].ContentItem[0].DataContent[0].html[0].body[0].pre[0]._);


                      }

                  }
                  else {
                      // res.send({"fullData": "ERROR parsing"});
                      console.log("result is empty");
                      return "result is empty";
                  }
              });



                }

              }

                if(newMsg){
                  // console.table(["Main result", newMsg.length, newMsg[0].ContentItem[0].DataContent[0].html[0].body[0].pre[0]._]);


                  for(let i in newMsg){
                    fullData.push({topic: newMsg[i].NewsLines[0].HeadLine[0], body : newMsg[i].ContentItem[0].DataContent[0].html[0].body[0].pre[0]._, ID: i})
                  }

                  if(fullData){
                    res.send({"fullData": fullData});
                    res.end();
                  }else{
                    res.send({"fullData": "DANG!"});
                    res.end();
                  }

                };





              // res.send(`<div><h1>${msg1[1].topic}</h1><p>${msg1[1].body}</p></div>`);

            }).catch((error)=>{
              console.table(["Error from news1", error]);
            });



});




module.exports = router;
