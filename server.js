/*
 * Module dependencies
 */

var config = require('./config');
var express = require('express');
var http = require('http');
var seaport = require('seaport');
var sio = require('socket.io');

/**
 * Module variables
 */

var app = express();
var server = http.Server(app);
var io = sio(server);
var ports = seaport.connect('localhost', 9090);

ports.get('game@0.0.0', function(ps) {
  console.log(ps);
});

/**
 * Routes
 */

app.use(express.static(__dirname + '/public'));

/**
 * Socket
 */

io.on('connection', function(socket) {
  socket.emit('ping', {
    status: 'OK'
  });

  socket.on('pong', function(data) {
    console.log(data);
  });
});

/**
 * Start the server
 */

server.listen(config.port, function(err) {
  if(err) {
    console.log('Failed to start server: ' + err);
  }
  console.log('Server started on port ' + config.port);
});
