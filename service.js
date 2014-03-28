var express = require('express');

var ServerController = require('./controllers/Server.js');
var LiveMapController = require('./controllers/LiveMap.js');
var ServerModel = require('./models/Server.js');
var LogModel = require('./models/Log.js');

var config = require('./config.js');

config.servers.forEach(function(server) {
    new ServerModel(server);
});
var log = new LogModel(config.log);
ServerModel.setupLogger(log);

var serverController = new ServerController();
var liveMapController = new LiveMapController();

var app = express();
app.use(express.bodyParser());
app.use(express.compress());

app.get('/server/:id', serverController.getServerInfo.bind(serverController));
app.get('/livemap/:id', liveMapController.getLiveMap.bind(liveMapController));

app.listen(3000);

