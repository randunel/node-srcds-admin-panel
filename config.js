module.exports = {
    servers: [ {
        id: 0,
        server: {
            address: '127.0.1.1:27015',
            password: 'test'
        }
    } ],
    log: {
        address: '192.168.0.14',
        port: 27017,
        authorized: 0 // falsey values == all
    }
};
