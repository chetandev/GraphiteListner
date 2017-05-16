var express = require('express');
var router = express.Router();
var graphiteBl = require(__base + '/bl/graphite_bl.js')
var slackBl = require(__base + '/bl/slack.js')
var sshBl = require(__base + '/bl/ssh.js')
var mysqlDal = require(__base + '/dal/mysql.js')



/**
 * @param  {[type]}
 * @param  {Array}
 * @return {[type]}
 */
router.post('/', function(req, res) {
    var ip = req.body.message;
    var ruleName = req.body.ruleName;
    var ruleUrl = req.body.ruleUrl;
    var state = req.body.state;
    var title = req.body.title;


    if (state.toLowerCase() == "ok") {
        mysqlDal.updateDatabase(req.body)
            .then(function(result) {
                res.send('success')

            }).catch(function(err) {
                res.send(err.message)
            })
    }

    if (state.toLowerCase() == "alerting") {

        mysqlDal.updateDatabase(req.body)
            .then(function(result) {
                return sshBl.executeShell(req.body, ip, 'bash test.bash test')
            })
            .then(function(result) {
                if (result == 0) {
                    slackBl.sendAlert(req.body, 'test', 'need manual efforts')
                }
                if (result == 1) {
                    slackBl.sendOk(req.body, 'test', 'memory metrix ran successfully')
                }
            })
            .then(function(result) {
                res.send('success')
            })
            .catch(function(err) {
                res.send(err.message)
            })
    }

});


router.get('/', function(req, res) {
    //mysql 
    mysqlDal.getServerStatus()
        .then(function(result) {
            res.send(result[0])
        })
        .catch(function(err) {
            res.send(err)

        })
});


module.exports = router;



// headers
// { host: '52.66.180.38:3001',
//   'user-agent': 'Grafana',
//   'content-length': '267',
//   'content-type': 'application/json',
//   'accept-encoding': 'gzip' }
// body
// { evalMatches: [],
//   message: '172.23.80.115',
//   ruleId: 1,
//   ruleName: 'Memory-Metrics alert',
//   ruleUrl: 'http://localhost:3000/dashboard/db/collect_d-metrics?fullscreen&edit&tab=alert&panelId=1&orgId=1',
//   state: 'ok',
//   title: '[OK] Memory-Metrics alert' }
