'use strict';

angular.module('app.recover', [
])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('recover', {
      url: '/recover',
      views: {
        '': {
          templateUrl: 'recover.html',
          controller: 'RecoverController'
        },
        'nav@': {
          templateUrl: 'nav-out.html',
          controller: 'NavOutController'
        }
      }
    })
})
.controller('RecoverController', [
  '$scope',
  '$state',
  '$resource',
  '$location',
function($scope, $state, $resource, $location) {
  $scope.query = {
    email: $location.search().email,
    token: $location.search().token
  }
  $scope.recover = function() {
    $resource('/api/user/recover/').save($scope.query, function() {
    }, function(err) {
      console.log(err);
    });
  }
}])
