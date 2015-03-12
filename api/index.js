/**
 * Module dependencies
 */

var _ = require('lodash');
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../lib/models').User;

/**
 * Module variables
 */

var router = module.exports = express.Router();

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
      if(!user || user.password !== password) {
        return done(null, false, {
          message: 'Bad username or password.'
        });
      }

      var user = user.toObject();
      delete user._id;
      delete user.password;
      delete user.salt;

      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  User.findOne({ email: email }, function(err, user) {
    done(err, user);
  });
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
