/**
 * Module dependencies
 */

var express = require('express');
var fs = require('fs');
var mustache = require('mustache');

/**
 * Module variables
 */

var router = module.exports = express.Router();

/**
 * GET /play/:server/:version
 */

router.get('/:server/:version', function(req, res, next) {
  var server = req.param('server');
  var version = req.param('version');

  fs.readFile(__dirname + '/template.html', function(err, file) {
    var template = file.toString()

    var client = '/clients/' + version + '/build/game.js';

    var view = {
      server: server,
      client: clientUrl
    }

    var rendered = mustache.render(template, view);
    return res.send(rendered);
  });
});
