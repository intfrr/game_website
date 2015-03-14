'use strict';

angular.module('app.register', [
])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('register', {
      url: '/register',
      views: {
        '': {
          templateUrl: 'register.html',
          controller: 'RegisterController'
        },
        'nav@': {
          templateUrl: 'nav-out.html',
          controller: 'NavOutController'
        }
      }
    });
})
.controller('RegisterController', [
  '$scope',
  '$state',
  '$resource',
function($scope, $state, $resource) {
  $scope.query = {
    name: '',
    password: ''
  };

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

  $scope.emailConditions = [{
    message: 'Valid email address',
    test: function() {
      // TODO: This isn't perfect
      return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
        .test($scope.query.email);
    }
  }];

  $scope.passConditions = [{
    message: 'Between 8 and 20 characters',
    test: function() {
      return $scope.query.password.length >= 8 &&
        $scope.query.password.length <= 20
    }
  }, {
    message: 'Contain only letters, digits, or any of !@#$%&*',
    test: function() {
      return /^[a-zA-Z0-9!@#$%&*]*$/
        .test($scope.query.password);
    }
  }];

  $scope.checkAllConditions = function() {
    for(var i=0; i<$scope.emailConditions.length; i++) {
      if(!$scope.emailConditions[i].test()) {
        return false;
      }
    }
    for(var i=0; i<$scope.passConditions.length; i++) {
      if(!$scope.passConditions[i].test()) {
        return false;
      }
    }
    return true;
  }

  $scope.register = function() {
    if($scope.checkAllConditions()) {
      $resource('/api/user').save($scope.query, function() {
        $state.go('list');
      }, function(err) {
        $scope.flash = err.data.message;
      });
    } else {
      angular.element(document.querySelector('#register-button'))
        .addClass('btn-danger')
        .removeClass('btn-default');

      var unregister = $scope.$watch('checkAllConditions()', function(newValue, oldValue) {
        if(newValue === true) {
          angular.element(document.querySelector('#register-button'))
            .addClass('btn-default')
            .removeClass('btn-danger');
          unregister();
        }
      });
    }
  }

}])
