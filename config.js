const path = require('path');

module.exports = {
    "httpPort": 3000,
    "httpsPort": 3001, //the port for https
    "serverKey": path.join(__dirname,'server.key'),
    "serverCert": path.join(__dirname,'server.crt'),
    "dbLocation": "mongodb://localhost/activityPubBloggingPlatform",
    "sessionSecret": "J4$58%*@AFJk%9(Ajfkajf83qf23fn8(bz)", //change me
    "privateKeyPassphrase": "ljkadf*33819(#*1b31b)" //change me
}
