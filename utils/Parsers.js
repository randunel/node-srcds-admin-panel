module.exports = {
    parseStatus: function(string) {
        // TODO: convert this parser into a RegEx parser
        console.log('parsing', string);
        var result = {};
        var items = string.split('\n');

        // The first item contains the hostname
        // hostname: ServerName
        result.name = items[0].split('hostname: ')[1];

        // The second item contains the srcds version and VAC data
        // version : X.Y.Z/build prot (in)secure
        var rawVersionArray = items[1].split('version : ')[1].split(' ');
        if(rawVersionArray.length == 2) rawVersionArray.splice(1, 0, '');
        result.version = [rawVersionArray[0]].concat(rawVersionArray[1]).join(' ');
        result.secure = rawVersionArray[2] == 'secure' ? true : false;

        // The third item is the ip address
        // udp/ip  : IP:port  (public ip: IP)
        var rawIp = items[2].split(': ');
        if(rawIp.length <= 2) {
            result.address = rawIp[1].split(':')[0];
            result.port = rawIp[1].split(':')[1];
        }
        else if(rawIp.length > 2) {
            var tempIp = rawIp[1].split(' ')[0].split(':');
            result.localAddress = tempIp[0];
            result.localPort = tempIp[1];
            result.address = rawIp[2].split(')')[0];
            result.port = result.localPort;
        }

        // The fourth item is the os
        // os    :  Linux
        var tempOs = items[3].split(' ');
        result.os = tempOs[tempOs.length - 1];

        // The fifth item is the server type
        // type   :  community dedicated
        result.type = items[4].split(': ')[1].split('').reverse().join('').trim().split('').reverse().join('').trim();

        // The sixth item is the map name
        // map     : de_dust
        result.map = items[5].split(': ')[1].split('').reverse().join('').trim().split('').reverse().join('').trim();

        // The seventh element contains player info
        // players : 10 humans, 0 bots (20/10 max) (hibernating)
        var tempPlayers = items[6].split(':')[1].split(' ');
        result.humans = tempPlayers[1];
        result.bots = tempPlayers[3];
        var tempSlots = tempPlayers[5].split('(')[1].split('/');
        result.maxplayers = tempSlots[0];
        result.players = tempSlots[1];
        result.hibernating = items[6].indexOf('hibernating') > -1 ? true : false;

        // The eigth element is an empty newline
        // The nineth element is the column header
        // # userid name uniqueid connected ping loss stats rate adr
        // TODO: parse player data according to column header
        //
        // The last element is '#end'
        return result;
    },
    parseLogaddressList: function(string) {
        if(string.indexOf('no addresses in the list') > -1) return [];
        var list = [];
        var items = string.split('\n');
        items.shift();
        // Test for printable ascii chars only
        items.forEach(function(address) {
            if(/^[\040-\176]*$/.test(address) && address.length > 0) {
                list.push(address);
            }
        });
        return list;
    }
};

