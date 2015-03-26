/**
 * Module dependencies
 */

var _ = require('lodash');
var async = require('async');
var config = require('../config');
var fs = require('fs');
var gethub = require('gethub');
var GitHubApi = require('github');
var https = require('https');
var path = require('path');

/**
 * Setup Github api
 */

var github = new GitHubApi({
  version: '3.0.0',
  headers: {
    'user-agent': 'Jordonias-Game'
  }
});

github.authenticate({
  type: 'basic',
  username: config.github.user,
  password: config.github.pass,
});

/**
 * Get all client releases currently not downloaded
 * @param {function} done
 */

exports.get = function(done) {
  github.releases.listReleases({
    owner: 'jordonias',
    repo: 'game_client'
  }, function(err, res) {
    var releases = [];
    var downloadPath = path.join(__dirname, '../public/clients/');

    for(var i=0; i<res.length; i++) {
      releases.push(res[i].tag_name);
    }

    fs.readdir(downloadPath, function(err, files) {
      var newReleases = _.difference(releases, files);

      async.each(newReleases, function(release, cb) {
        var releasePath = downloadPath + release;
        gethub('jordonias', 'game_client', release, releasePath, function(err) {
          return cb(err);
        });
      }, function(err) {
        if(err) {
          return done(err);
        }
        return done(null, newReleases);
      });
    });
  });
}
