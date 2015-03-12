'use strict';

angular.module('app.register', [
])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('register', {
      url: '/register',
      templateUrl: 'register.html',
      controller: 'RegisterController'
    })
})
.controller('RegisterController', [
  '$scope',
  '$state',
  '$resource',
function($scope, $state, $resource) {
  $scope.register = function() {
    $resource('/api/user').save($scope.query, function() {
      $state.go('list');
    }, function(err) {
      console.log(err);
    });
  }
}])
