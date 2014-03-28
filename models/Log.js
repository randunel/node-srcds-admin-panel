var SrcdsLog = require('srcds-log');
var EventEmitter = require('events').EventEmitter;

module.exports = Log;

function Log(config) {
    this.config = config;
    this.sock = new SrcdsLog( {
        address: config.address || '0.0.0.0',
        port: config.port,
        authorized: config.authorized
    });

    this.sock.on('data', function(data) {
        console.log('log', data);
    });
}

Log.prototype.__proto__ = EventEmitter.prototype;

