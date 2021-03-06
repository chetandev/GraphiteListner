'use strict'
var mysql = require('mysql');
var Promise = require('bluebird');
var connectionManager = require(__base + '/connectionmanager');
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);
var mysqlConnectionPool = connectionManager.getMySqlConnectionPool();
var statsd = require(__base + '/statsd.js')

statsd.gauge("graphitelistner.mysql.connections", mysqlConnectionPool._allConnections.length)


console.log("connections:" + mysqlConnectionPool._allConnections.length)

function obj() {

    this.updateDatabase = function(data, funcName, description) {
        return new Promise(function(resolve, reject) {
            var qryInsertOrders = `call updateServerStatus (?,?,?,?,?,?,?);`

            var arr = [
                data.message, //ip
                data.ruleName,
                data.ruleUrl,
                data.state,
                data.title,
                funcName,
                description
            ];
            mysqlConnectionPool.queryAsync(qryInsertOrders, arr)
                .then(function(results) {

                    resolve(results);
                    statsd.increment('graphitelistner.mysql.query_per_sec');
                })
                .catch(function(err) {
                    console.log(err)
                    reject(err);
                    statsd.increment('graphitelistner.mysql.error');
                });

        });

    };


    this.getServerStatus = function() {
        return new Promise(function(resolve, reject) {
            var qryInsertOrders = `call getServerStatus;`

            var arr = [];
            mysqlConnectionPool.queryAsync(qryInsertOrders, arr)
                .then(function(results) {
                    resolve(results);
                    statsd.increment('graphitelistner.mysql.query_per_sec');
                })
                .catch(function(err) {
                    console.log(err)
                    reject(err);
                    statsd.increment('graphitelistner.mysql.error');
                });

        });

    };
}

module.exports = new obj();
