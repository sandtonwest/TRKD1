var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

//RequestBody body2 = RequestBody.create(JSON, "{\"CreateServiceToken_Request_1\":{\"ApplicationID\":\"trkddemoappwm\", \"Username\":\"trkd-demo-wm@thomsonreuters.com\" ,\"Password\":\"x8e4x23oo\" }})");

 var requestBody = {"CreateServiceToken_Request_1":{"ApplicationID":"trkddemoappwm","Username":"trkd-demo-wm@thomsonreuters.com","Password":"x8e4x23oo"}};
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    function sendReq() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }

    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendReq();
});

client.connect('https://api.trkd.thomsonreuters.com/api/TokenManagement/TokenManagement.svc/REST/Anonymous/TokenManagement_1/CreateServiceToken_1', 'echo-protocol');
