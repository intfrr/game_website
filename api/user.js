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
  res.status = 400;

  if(typeof req.body.email === 'undefined') {
    return next('Must specify an email.');
  }

  var email = req.body.email;

  if(typeof req.body.password === 'undefined') {
    return next('Must specify a password.');
  }

  if(typeof req.body.confirmPassword === 'undefined' ||
      req.body.confirmPassword !== req.body.password) {
    return next('Passwords must match.');
  }

  var password = req.body.password;
  res.status = 200;

  async.waterfall([
    // Check if user already exists
    function(cb) {
      User.findOne({ email: req.body.email }, cb);
    },
    // Generate the salt
    function(user, cb) {
      if(user !== null) {
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
    return res.json({
      status: 'OK',
      result: result
    });
  });
});
