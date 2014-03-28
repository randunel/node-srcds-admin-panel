var Server = require('../models/Server.js');
module.exports = Controller;

function Controller() {}

Controller.prototype.getServerInfo = function(req, res) {
    Server.getStatus(req.params.id, function(err, status) {
        if(err) {
            console.log('Error', err);
            res.json( {
                result: 'err'
            }, 400);
            return;
        }
        res.json( {
            result: status
        });
    });
};
