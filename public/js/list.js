'use strict';

angular.module('app.list', [
])
.config(function($stateProvider) {
  $stateProvider
    .state('list', {
      url: '/list',
      templateUrl: 'list.html',
      controller: 'ListController'
    });
})
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
