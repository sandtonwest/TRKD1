var express = require('express');
var router = express.Router();
const TokenEvent = require("../lib/tokenEvent_controller");
const news_headline = require("../lib/trkd-news-headlines");
const newsRetrieval = require("../lib/trkd-retrieve-news");

  var token_1;

TokenEvent.on("getTokenSuccess", function(token){

  token_1 = token;




});

/* GET users listing. */
router.get('/news_H/:code', function(req, res, next) {
  console.log("token_1", token_1);




  if(typeof token_1 !== "undefined"){


  }
    // res.send('respond with a resource2', token_1);

    var getNewsHead = async function(){
      console.log("newsHdiv");
      // setTimeout(quoteWidget.getQuoteJSON(ric), 1500)
      return news_headline.getNewsHDiv();

    };

  var bucket = [];

  var poll = async function(result){
    let i;
      var nunu1 = [];
      var nunu = [];
      var items1;
    for(i = 0; i < result.HL.length; i++ ){
      // console.log("last!!! " ,result.HL[i]);
      // console.log("HT", result.HL[i].HT);



       items1 = await newsRetrieval.getNewsHDiv(result.HL[i].ID)
      .then(async function(result2){


        // console.table(["items ", result2.Story]);
        console.log("HT", result.HL[i].HT);
        await bucket.push({"topic": result.HL[i].HT, "body":result2.Story});
        await nunu.push({"topic": result.HL[i].HT, "body":result2.Story});
        // console.log("nunu size", nunu.length);
        // console.log("bucket1", bucket.length);


        // console.log(result2);
        nunu1 = await nunu;

        return await nunu;


      });

    }
    console.log("@@@@@@", items1.length);
    return await bucket;

  }

    try{
        var news1 = async function(){
          // var rez;
          let rez = await getNewsHead();
          let item = await poll(rez);
/*
        let rez = await getNewsHead()
        .then(async (result)=>{
          // console.log("REZ3",result);
          var nuns = poll(result)
          .then((ref)=>{
            console.log("ref", ref.length);
            return ref;
          });



          console.log("hello 2!", nuns.length);


          return await nuns;

        })
        */
        console.log("REZ1", await item.length);
         return await item;
       };
            console.log("TANGO", news1().then((msg)=>{console.log(msg.ID)}));
            news1()
            .then((msg1)=>{
              console.log("tango river delta", msg1.length);
              console.log(msg1[0].topic);
              res.send(`<div><h1>${msg1[1].topic}</h1><p>${msg1[1].body}</p></div>`);
            }).catch((error)=>{
              console.table(["Error", error]);
            });

    }catch(e){
      throw e;
    }


});




module.exports = router;
