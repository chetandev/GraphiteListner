var StatsD = require('node-statsd'),
    client = new StatsD();


client.socket.on('error', function(error) {
    console.log(error)
});


module.exports = client;
