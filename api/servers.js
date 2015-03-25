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
    // TODO: Manage different host names?
    for(var i=0; i<ps.length; i++) {
      if(ps[i].host === '127.0.0.1') {
        ps[i].host = 'jordonias.com';
      }
    }
    return res.json({
      status: 'OK',
      result: ps
    });
  });
});
