/**
 * Module dependencies
 */

var async = require('async');
var crypto = require('crypto');
var express = require('express');
var passport = require('passport');
var User = require('../lib/models').User;

/**
 * Module variables
 */

var router = module.exports = express.Router();

/**
 * POST /api/user/login
 */

router.post('/login', passport.authenticate('local'), function(req, res) {
  return res.json({
    status: 'OK',
    result: req.user
  });
});

/**
 * POST /api/user
 */

router.post('/', function(req, res, next) {
  if(typeof req.body.email === 'undefined') {
    res.status(400);
    return next('Must specify an email.');
  }

  var email = req.body.email;

  if(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
    res.status(400);
    return next('Invalid email.');
  }

  if(typeof req.body.password === 'undefined') {
    res.status(400);
    return next('Must specify a password.');
  }

  var password = req.body.password;

  if(!/^[a-zA-Z0-9!@#$%&*]{8,20}$/.test(password)) {
    res.status(400);
    return next('Password does not meet criteria.');
  }

  async.waterfall([
    // Check if email already exists
    function(cb) {
      User.findOne({ email: req.body.email }, cb);
    },
    // Generate the salt
    function(user, cb) {
      if(user !== null) {
        res.status(400);
        return cb('An account is already registered to that email.');
      }

      crypto.randomBytes(64, function(err, salt) {
        if(err) {
          return cb('Internal server error. Try again.');
        }
        cb(null, salt);
      });
    },
    // Hash and salt the password
    function(salt, cb) {
      crypto.pbkdf2(password, salt, 8192, 512, function(err, key) {
        if(err) {
          return cb('Internal server error. Try again.');
        }

        var user = {
          email: email,
          password: key,
          salt: salt
        }

        cb(null, user);
      });
    },
    // Insert the user in the database
    function(user, cb) {
      var newUser = new User(user);

      newUser.save(function(err, result) {
        if(err) {
          return cb('Internal server error. Try again.');
        }

        cb(null, user);
      });
    }
  ], function(err, result) {
    if(err) {
      return next(err);
    }
    req.login(result, function(err) {
      if(err) {
        return res.send('hi');
      }
      return res.json({
        status: 'OK',
        result: result
      });
    });
  });
});
