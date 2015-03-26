/**
 * Module dependencies
 */

var express = require('express');
var fs = require('fs');
var mustache = require('mustache');
var servers = require('../lib/servers');

/**
 * Module variables
 */

var router = module.exports = express.Router();

/**
 * GET /play/:serverid
 */

router.get('/:serverid', function(req, res, next) {
  var id = req.params.serverid;

  fs.readFile(__dirname + '/template.html', function(err, file) {
    var template = file.toString()

    var server = servers.get(id);

    var socketUrl = server.host + ':' + server.port;
    var client = '/clients/' + server.version + '/build/game.js';

    var view = {
      server: socketUrl,
      client: client
    }

    var rendered = mustache.render(template, view);
    return res.send(rendered);
  });
});
