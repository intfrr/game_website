/**
 * Module dependencies
 */

var express = require('express');
var servers = require('../lib/servers');

/**
 * Module variables
 */

var router = module.exports = express.Router();

/**
 * GET /api/servers
 */

router.get('/', function(req, res, next) {
  var result = servers.get();

  return res.json({
    status: 'OK',
    result: result
  });
});
