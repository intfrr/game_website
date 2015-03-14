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
  // TODO: show/hide password to directive
  $scope.showPassword = function() {
    angular.element(document.querySelector('#password'))
      .css('display', 'none')
    angular.element(document.querySelector('#password-reveal'))
      .css('display', 'block')
    angular.element(document.querySelector('#password-eye'))
      .css('color', '#337ab7')
  }

  $scope.hidePassword = function() {
    angular.element(document.querySelector('#password-reveal'))
      .css('display', 'none');
    angular.element(document.querySelector('#password'))
      .css('display', 'block');
    angular.element(document.querySelector('#password-eye'))
      .css('color', '')
  }

  $scope.register = function() {
    $resource('/api/user').save($scope.query, function() {
      $state.go('list');

    }, function(err) {
      console.log(err);
    });
  }
}])
