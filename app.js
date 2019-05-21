require("dotenv").config();
const http = require("http");
const path = require("path");
const fs = require("fs");
const url = require("url");
const auth_controller = require("./lib/trkd-authenticator");
const quoteWidget = require("./lib/trkd-q");

const news_headline_Widget = require("./lib/trkd-news-headlines");
const TokenEvent = require("./lib/tokenEvent_controller");

//const fundamentalWidget = require("./lib/trkd-finStatement");

const express = require('express')
var bodyParser = require('body-parser');
const app = express()
const hbs = require('hbs')
var server;

hbs.registerHelper("debug", function(optionalValue, req) {
  console.log("REQ!!!!!!", req);
  counter = 1;
  counter = counter + 1;

  //res.redirect(req.get('referer'));
  // console.log(location.href);
  // window.location.reload(location.href);
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
  console.log(counter++);
  return counter++;
});

app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'public', 'views'));
//app.set('views', "public");
//console.log("_____________________", path.join(__dirname, 'public', 'views'));
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: false }));

var quote = require('./routes/quote');
var multiQuote = require('./routes/multi_quote');
var news_headlines = require('./routes/news_headlines');
var index = require('./routes/index');
var test = require('./routes/test');
var chart = require('./routes/chart');
var timeseries = require('./routes/timeseries');

console.log(process.env.name, process.env.password);

const indexFile = "index.html";
const port = process.env.httpPort || 3000;


app.use("/", quote);
app.use("/", multiQuote);
app.use("/", news_headlines);
app.use("/", index);
app.use("/test", test);
app.use("/", chart);
app.use("/", timeseries);

//quoteWidget.getQuoteDiv("ZAR=");

app.use(function(req, res, next) {

  var err = new Error(`${req.url} NOT FOUND`);
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.status(err.status).send("ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  //res.send("an error occured", err);
  res.render('error');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



const chartWidget = require("./lib/cht");
//var xyz = chartWidget.getChart();
//console.log(xyz);





console.log("Requesting API authorization token...");
console.log(process.env.user, process.env.password, process.env.applicationID);

server = app.listen(process.env.PORT || 3000, function(){
  console.log("Node server HTTP started on: " + port);


auth_controller.authenticate(process.env.user, process.env.password, process.env.applicationID)
  .then(token => {
    // successful authentication, keep a global copy of appID and token
    global.applicationID = process.env.applicationID;
    global.token = token;
    TokenEvent.emit("getTokenSuccess", token, process.env.applicationID);
    console.log(`Received authorization token: ${token}`);

    console.log("Starting HTTP server...");
    // start the http server


  })
  .catch(err => {
    console.log("Unable to get authentication token. Please check username/password");
    console.log("");
    console.log("Received error: ", err);
    server.close();
    server.start();
    reload(app);

    if(err.errno){
      // server.close();
      console.log("Error with Error num",err.errno);

    }else if(err){
      // server.close();
      console.log("ERROR", err);

    }
  });


function setToken(){
  console.log("Restarting");
  //server.close();
  auth_controller.authenticate(process.env.user, process.env.password, process.env.applicationID)
  	.then(token => {
  		// successful authentication, keep a global copy of appID and token
  		// global.applicationID = process.env.applicationID;
  		global.token = token;
      TokenEvent.emit("getTokenSuccess", token, process.env.applicationID);
  		// console.log(`Received authorization token: ${token}`);

  		//console.log("Starting HTTP server...");
  		// start the http server
  		//server = app.listen(port, function(){
  			//console.log("Node server HTTP started on: " + port);
  		//});

  	})
  	.catch(err => {
  		console.log("Unable to get authentication token. Please check username/password");
  		// console.log("");
  		console.log("Received error: ", err);
      reload(app);
      server.start();
      return Promise.reject("auth problems", err);
      if(err.errno){
        var reload = require('reload')
        server.close();
        server.start();
        reload(app);

      }
  	});

};

function test(){
  console.log("Runnin function test");
};

// test();

//setTimeout(test ,6000);
setInterval(setToken ,4800000);
// setTimeout(setToken ,288000);


count = 0;
TokenEvent.on("getTokenSuccess", (token)=>{
  count = count + 1;
  // console.table(["token recie", token , count]);
  setInterval(setToken ,4800000);
});

});

  module.exports = app;
