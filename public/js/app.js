'use strict';

angular.module('gameWebsiteApp', [
  'ui.router',
  'ngResource'
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
  '$resource',
function($scope, $state, $resource) {
  $scope.login = function() {
    $resource('/api/user/login/').save($scope.query, function() {
      $state.go('list');
    }, function(err) {
      console.log(err);
    });
  }
}])

/**
 * List Controller
 */

.controller('ListController', [
  '$scope',
  '$state',
  '$resource',
function($scope, $state, $resource) {
  var Server = $resource('/api/servers/:serverId', { serverId: '@id' });

  Server.get(function(servers) {
    $scope.servers = servers.result;
  }, function(err) {
    $scope.servers = [];
    $scope.errorMessage = 'Could not get server list.';
  });
}]);
