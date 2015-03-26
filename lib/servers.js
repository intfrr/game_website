/**
 * Module dependencies
 */

var config = require('../config');
var seaport = require('seaport');

/**
 * Module variables
 */

var ports = seaport.connect('localhost', 9090);
var servers = [];

/**
 * Update the server list
 * @param {function} cb
 */

exports.find = function(cb) {
  ports.get('game', function(ps) {
    // TODO: Manage different host names?
    for(var i=0; i<ps.length; i++) {
      if(ps[i].host === '127.0.0.1') {
        ps[i].host = config.localhost;
      }
    }
    servers = ps;
    return cb();
  });
}

/**
 * Get a server by id
 * @param {function} cb
 */

exports.get = function(id) {
  if(typeof id === 'undefined') {
    return servers;
  }
  for(var i=0; i<servers.length; i++) {
    if(servers[i].id === id) {
      return servers[i];
    }
  }
  return null;
}
