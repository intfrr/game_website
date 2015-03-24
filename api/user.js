/**
 * Module dependencies
 */

var async = require('async');
var config = require('../config');
var crypto = require('crypto');
var express = require('express');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../lib/models').User;

/**
 * Module variables
 */

var router = module.exports = express.Router();
var transporter = nodemailer.createTransport(config.smtp);

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
 * GET /api/user/logout
 */

router.get('/logout', function(req, res) {
  req.logout();
  return res.redirect('/');
});

/**
 * GET /api/user
 */

router.get('/', function(req, res, next) {
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

  if(!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
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

/**
 * POST /api/user/reset
 */

router.post('/reset', function(req, res, next) {
  if(typeof req.body.email === 'undefined') {
    res.status(400);
    return next('Must specify an email.');
  }

  if(!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(req.body.email)) {
    res.status(400);
    return next('Invalid email.');
  }

  User.findOne({ email: req.body.email }, function(err, user) {
    if(err) {
      return next('Failed to submit reset request. Try later.');
    }
    if(!user) {
      res.status(400);
      return next('Invalid email.');
    }
    if(user.reset.status) {
      /*
      if(Date.now() - user.reset.requestedAt.getTime() < 60*60*1000) {
        res.status(400);
        return next('Reset already requested in the last hour.');
      }
      */
    }

    crypto.randomBytes(16, function(err, buf) {
      if(err) {
        return next('Failed to submit reset request. Try later.');
      }

      var token = buf.toString('hex');

      user.reset.status = true;
      user.reset.requestedAt = new Date();
      user.reset.token = token;

      user.save(function(err) {
        if(err) {
          return next('Failed to submit reset request. Try later.');
        }

        transporter.sendMail({
          from: config.smtp.auth.user,
          to: user.email,
          subject: 'Password reset',
          // TODO: Template
          text: 'A request was made to reset your password\n' +
            'Visit http://game.jordonias.com/api/user/recover/' + token + '?email=' + user.email
        });

        return res.json({
          status: 'OK',
          result: 1
        });
      });
    });
  });
});

/**
 * GET /api/user/recover/:token
 */

router.get('/recover/:token', function(req, res, next) {
  if(typeof req.query.email === 'undefined') {
    res.status(400);
    return next('No email specified.');
  }

  User.findOne({ email: req.query.email }, function(err, user) {
    return res.json({
      test: 'reset here'
    });
  });
});

/**
 * GET /api/user/token
 */

router.get('/token', function(req, res, next) {
  // TODO: Use priv/pub keys
  var token = jwt.sign(req.user, config.token_secret, {
    expiresInMinutes: 1440
  });

  return res.json({
    status: 'OK',
    result: token
  });
});
