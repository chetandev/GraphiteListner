var express = require('express');
var router = express.Router();
var graphiteBl = require(__base + '/bl/graphite_bl.js')


/**
 * @param  {[type]}
 * @param  {Array}
 * @return {[type]}
 */
router.post('/', function(req, res) {
    console.log('headers')
    console.log(req.headers)
    console.log('body')
    console.log(req.body)

    res.send('ok')

});






module.exports = router;
