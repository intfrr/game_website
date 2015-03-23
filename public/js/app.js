'use strict';

angular.module('gameWebsiteApp', [
  'ui.router',
  'ngResource',
  'nav',
  'app.login',
  'app.list',
  'app.register',
  'app.reset',
  'app.recover',
  'revealPassword'
])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
});
