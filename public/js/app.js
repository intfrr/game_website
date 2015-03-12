'use strict';

angular.module('gameWebsiteApp', [
  'ui.router',
  'ngResource',
  'app.login',
  'app.list',
  'app.register'
])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
});
