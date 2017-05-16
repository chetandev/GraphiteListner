var express = require('express');
var app = express();
var graphiteController = require(__base + '/controller/graphite.js');




app.use('/', graphiteController);






module.exports = app;
