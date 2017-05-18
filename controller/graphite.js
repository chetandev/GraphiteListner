var express = require('express');
var router = express.Router();
var graphiteBl = require(__base + '/bl/graphite_bl.js')



/**
 * @param  {[type]}
 * @param  {Array}
 * @return {[type]}
 */
router.post('/', function(req, res) {

    graphiteBl.process_graphana_data(req.body)
        .then(function(result) {

            res.send('success')
        })
        .catch(function(err) {
            res.send(err)

        })

});


router.get('/', function(req, res) {

    graphiteBl.getServerStatus()
        .then(function(result) {
            res.send(result)
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
//   
//   


// memory_cleanup 
// disk_cleanup
// node_process_start
// cassandra_process_start
// mysql_process_start
