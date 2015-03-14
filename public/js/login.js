'use strict';

angular.module('app.login', [
])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/',
      views: {
        '': {
          templateUrl: 'login.html',
          controller: 'LoginController'
        },
        'nav@': {
          templateUrl: 'nav-out.html',
          controller: 'NavOutController'
        }
      }
    })
})
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
