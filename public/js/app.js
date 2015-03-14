'use strict';

angular.module('gameWebsiteApp', [
  'ui.router',
  'ngResource',
  'nav',
  'app.login',
  'app.list',
  'app.register'
])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
});
