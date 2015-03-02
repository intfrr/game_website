'use strict';

angular.module('gameWebsiteApp', [
  'ui.router'
])

/**
 * Config
 */

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('login', {
      url: '/',
      templateUrl: 'login.html',
      controller: 'LoginController'
    })
    .state('list', {
      url: '/list',
      templateUrl: 'list.html',
      controller: 'ListController'
    });
})

/**
 * Login Controller
 */

.controller('LoginController', [
  '$scope',
  '$state',
function($scope, $state) {
  $scope.login = function() {
    $state.go('list');
  }
}])

/**
 * List Controller
 */

.controller('ListController', [
  '$scope',
  '$state',
function($scope) {

}]);
