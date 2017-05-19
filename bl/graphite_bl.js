var slackBl = require(__base + '/bl/slack.js')
var sshBl = require(__base + '/bl/ssh.js')
var mysqlDal = require(__base + '/dal/mysql.js')
var _ = require('underscore')
var Promise = require('bluebird');

function process_graphana_data(data) {
    return new Promise(function(resolve, reject) {
        var ip = data.message;
        var ruleName = data.ruleName;
        var ruleUrl = data.ruleUrl;
        var state = data.state;
        var title = data.title;

        if (state.toLowerCase() == "ok") {
            mysqlDal.updateDatabase(data)
                .then(function(result) {
                    resolve('success')

                }).catch(function(err) {
                    reject(err.message)
                })
        }

        if (state.toLowerCase() == "alerting") {
            mysqlDal.updateDatabase(data)
                .then(function(result) {
                    return sshBl.executeShell(data, ip, `bash ${__config.shell_script_name} ${ruleName}`)
                })
                .then(function(result) {
                    //comma separated 0,step1,step2,step3

                    var resultArray = result.split(',');

                    var code = resultArray[0];
                    var rules = result;

                    if (code == 0) {
                        slackBl.sendAlert(data, ruleName, `${rules} executed need manual efforts`)
                    }
                    if (code == 1) {
                        slackBl.sendOk(data, ruleName, `${rules} executed metrix ran successfully`)
                    }
                })
                .then(function(result) {
                    resolve('success')
                })
                .catch(function(err) {
                    reject(err.message)
                })
        }

    });
}


function getServerStatus() {
    return new Promise(function(resolve, reject) {
        mysqlDal.getServerStatus()
            .then(function(result) {
                var outAray = [];


                _.each(result[0], function(item) {
                    var stateArray = item.state.split(",");
                    var ruleNameArray = item.ruleName.split(",");
                    var ruleUrlArray = item.ruleUrl.split(",");
                    var out = {}

                    console.log(stateArray)

                    if (_.indexOf(stateArray, "alerting") == -1) {
                        out.ip = item.ip
                        out.state = "ok"
                        outAray.push(out)

                    } else {
                        for (var i = 0; i < stateArray.length; i++) {

                            if (stateArray[i] == "ok") {
                                ruleNameArray.splice(i, 1);
                                ruleUrlArray.splice(i, 1);
                            }
                        }

                        out.ip = item.ip
                        out.state = "alerting"
                        out.ruleName = ruleNameArray;
                        out.ruleUrl = ruleUrlArray;
                        outAray.push(out)
                    }
                });

                resolve(outAray)
            })
            .catch(function(err) {
                reject(err)

            })
    })
}


module.exports = { process_graphana_data, getServerStatus }
