'use strict';

angular.module('app.reset', [
])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('reset', {
      url: '/reset',
      views: {
        '': {
          templateUrl: 'reset.html',
          controller: 'ResetController'
        },
        'nav@': {
          templateUrl: 'nav-out.html',
          controller: 'NavOutController'
        }
      }
    })
})
.controller('ResetController', [
  '$scope',
  '$state',
  '$resource',
function($scope, $state, $resource) {
  $scope.reset = function() {
    $resource('/api/user/reset/').save($scope.query, function() {
//      $state.go('list');
    }, function(err) {
      console.log(err);
    });
  }
}])
