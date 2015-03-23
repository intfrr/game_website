/**
 * Module dependencies
 */

var _ = require('lodash');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var express = require('express');
var fs = require('fs');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../lib/models').User;

/**
 * Module variables
 */

var router = module.exports = express.Router();
var noAuth = [
  ['/user', 'post'],
  ['/user/login', 'post'],
  ['/user/logout', 'get'],
  ['/user/reset', 'post'],
  ['/user/recover/*', 'get']
];

/**
 * Middleware
 */

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(passport.initialize());
router.use(passport.session());

/**
 * Passport
 */

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
      if(err) {
        return done(err);
      }

      if(!user) {
        return done(null, false, {
          message: 'Bad username or password.'
        });
      }

      crypto.pbkdf2(password, user.salt, 8192, 512, function(err, key) {
        if(err) {
          return done(null, false, {
            message: 'Internal server error. Try again.'
          });
        }

        if(key.length !== user.password.length) {
          return done(null, false, {
            message: 'Bad username or password.'
          });
        }

        for(var i=0; i<key.length; i++) {
          if(key[i] !== user.password[i]) {
            return done(null, false, {
              message: 'Bad username or password.'
            });
          }
        }

        return done(null, {
          _id: user.id,
          email: user.email
        });
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  User.findOne({
    email: email
  }, {
    password: 0,
    salt: 0,
    reset: 0,
    __v: 0
  }, function(err, user) {
    done(err, user);
  });
});

router.use(function(req, res, next) {
  for(var i=0; i<noAuth.length; i++) {
    if(req.method.toLowerCase() === noAuth[i][1]) {
      var authUrl = noAuth[i][0];
      if((authUrl.slice(-2) === '/*' &&
          req.url.indexOf(authUrl.substring(0, authUrl.length-2)) === 0) ||
          req.url === authUrl) {
        return next();
      }
    }
  }
  if(req.isAuthenticated()) {
    return next();
  }
  res.status(401);
  return next('Not authorized.');
});

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

/**
 * Error middleware
 */

router.use(function(err, req, res, next) {
  if(res.statusCode === 200) {
    res.status(500);
  }

  var message;
  if(typeof err === 'string') {
    message = err;
  } else {
    message = 'Internal server error.'
  }

  return res.json({
    status: 'error',
    message: message
  });
});

router.use(function(req, res) {
  return res.json({
    status: 'error',
    message: 'Not found'
  });
});
