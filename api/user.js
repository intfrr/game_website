/**
 * Module dependencies
 */

var express = require('express');
var passport = require('passport');

/**
 * Module variables
 */

var router = module.exports = express.Router();

/**
 * /api/user/login
 */

router.post('/login', passport.authenticate('local'), function(req, res) {
  console.log(req.user);
  return res.json({
    status: 'OK',
  });
});
