/**
 * Module dependencies
 */

var express = require('express');
var seaport = require('seaport');

/**
 * Module variables
 */

var router = module.exports = express.Router();
var ports = seaport.connect('localhost', 9090);

/**
 * GET /api/servers
 */

router.get('/', function(req, res, next) {
  ports.get('game', function(ps) {
    return res.json({
      status: 'OK',
      result: ps
    });
  });
});
