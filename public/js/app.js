'use strict';

angular.module('gameWebsiteApp', [
  'ui.router',
  'ngResource',
  'app.login',
  'app.list'
])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
});
