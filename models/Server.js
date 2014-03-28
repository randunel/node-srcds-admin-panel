var Rcon = require('srcds-rcon');
var Parsers = require('../utils/Parsers.js');

module.exports = Server;

function Server(settings) {
    this.id = settings.id;
    this.server = settings.server;
    this.logger = null;
    this.rcon = new Rcon(this.server.address, this.server.password);
    this.rcon.connect();
    Server.addInstance(this);
}

Server.prototype.getStatus = function(cb) {
    var self = this;
    // TODO: implement server query to avoid the current parser
    this.rcon.hostname(function(err, res) {
        console.log('Handling getStatus for', res);
    });
    this.rcon.status(function(err, res) {
        if(err) {
            cb(err);
            return;
        }
        cb(null, Parsers.parseStatus(res));
    });
};

Server.prototype.setupLogger = function(logger, cb) {
    // This can be called before the rcon console connects
    if(!this.rcon.logaddress_list) {
        this.rcon.once('connect', this.setupLogger.bind(this, logger, cb));
        return;
    }
    var self = this;
    var logAddress = logger.config.address + ':' + logger.config.port;
    this.rcon.logaddress_list(function(err, res) {
        if(err) {
            cb && cb(err);
            return;
        }
        var list = Parsers.parseLogaddressList(res);
        if(list.length == 0 || list.indexOf(logAddress) == -1) {
            addLogger(self.rcon, logger, cb);
            return;
        }
        cb && cb();
    });

    function addLogger(rcon, address, cb) {
        rcon.logaddress_add(address, cb);
    }
};

Server.getStatus = function(id, cb) {
    if(!Server.instances[id]) {
        cb( {
            code: 'NOT_FOUND'
        });
        return;
    }
    Server.instances[id].getStatus(cb);
};

Server.instances = {};

Server.addInstance = function(instance) {
    Server.instances[instance.id.toString(10)] = instance;
};

Server.removeInstance = function(instance) {
    delete Server.instances[instance.settings.id];
};

Server.setupLogger = function(log) {
    // Only one logger is supported at the moment
    for(var key in Server.instances) {
        Server.instances[key].setupLogger(log);
    }
};

