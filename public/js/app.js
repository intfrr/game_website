'use strict';

angular.module('gameWebsiteApp', [
  'ui.router',
  'ngResource',
  'nav',
  'app.login',
  'app.list',
  'app.register',
  'app.reset',
  'app.recover'
])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
});
