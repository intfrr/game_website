/**
 * Module dependencies
 */

var _ = require('lodash');
var express = require('express');
var fs = require('fs');

/**
 * Module variables
 */

var router = module.exports = express.Router();

/**
 * Add API files
 */

var files = _.filter(fs.readdirSync(__dirname), function(x) {
  if(x === 'index.js') return false;
  return x.indexOf('.js', x.length-3) !== -1;
});

for(var i=0; i<files.length; i++) {
  var parts = files[i].split('.');
  if(parts.length === 2) {
    router.use('/' + parts[0], require('./' + files[i]));
  }
}
