/*
 * Module dependencies
 */

var api = require('./api');
var config = require('./config');
var express = require('express');
var http = require('http');
var logger = require('morgan');
var mongoose = require('mongoose');
var play = require('./play');
var releases = require('./lib/releases');
var seaport = require('seaport');
var session = require('express-session');
var sio = require('socket.io');

/**
 * Module variables
 */

var app = express();
var server = http.Server(app);
var io = sio(server);
var ports = seaport.connect('localhost', 9090);

/**
 * Mongoose
 */

mongoose.connect('mongodb://localhost/game');

/**
 * Middleware
 */

app.use(logger('dev'));
app.use(session({
  secret: config.session_secret,
  resave: false,
  saveUninitialized: true
}));

/**
 * API
 */

app.use('/api', api);

/**
 * Play
 */

app.use('/play', play);

/**
 * Static files
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
 * Client releases
 */

var getReleases = function() {
  releases.get(function(err, releases) {
    if(err) {
      console.log('Error: Failed to get client releases.');
    } else if(releases.length) {
      var list = releases.join(', ');
      console.log('Downloaded clients: [' + list + ']');
    }
    setTimeout(getReleases, 60*1000);
  });
}
getReleases();

/**
 * Start the server
 */

server.listen(config.port, function(err) {
  if(err) {
    console.log('Failed to start server: ' + err);
  }
  console.log('Server started on port ' + config.port);
});
