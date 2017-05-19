var mysql = require('mysql');
var Promise = require('bluebird');

function obj() {

    this.getMySqlConnection = function() {
        var connection = mysql.createConnection({
            host: '52.66.173.230',
            port: '3306',
            user: 'root',
            password: 'pass',
            connectTimeout: 60 * 10000, //1 min
            database: 'graphite',
            multipleStatements: true
        });
        return connection;
    };
    this.getMySqlConnectionPool = function() {
        var connection = mysql.createPool({
            connectionLimit: 20,
            host: '52.66.173.230',
            port: '3306',
            user: 'root',
            password: 'pass',
            connectTimeout: 60 * 10000, //1 min
            acquireTimeout: 30000, // 30s
            database: 'graphite',
            multipleStatements: true
        });
        return connection;
    };
}


module.exports = new obj();
