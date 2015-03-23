'use strict';

angular.module('revealPassword', [
])
.directive('revealPassword', function() {
  return {
    templateUrl: 'js/directives/reveal-password.html',
    replace: true,
    scope: {
      label: '@',
      ngModel: '='
    },
    link: function(scope, element, attrs) {
      scope.passConditions = [{
        message: 'Between 8 and 20 characters',
        test: function() {
          return typeof scope.ngModel !== 'undefined' &&
            scope.ngModel.length >= 8 &&
            scope.ngModel.length <= 20
        }
      }, {
        message: 'Contain only letters, digits, or any of !@#$%&*',
        test: function() {
          return /^[a-zA-Z0-9!@#$%&*]*$/
            .test(scope.ngModel);
        }
      }];
          
      scope.showPassword = function()  {
        angular.element(element[0].querySelector('#password'))
          .css('display', 'none');
        angular.element(element[0].querySelector('#password-reveal'))
          .css('display', 'block');
        angular.element(element[0].querySelector('#password-eye'))
          .css('color', '#337ab7');
      }

      scope.hidePassword = function() {
        angular.element(document.querySelector('#password-reveal'))
          .css('display', 'none');
        angular.element(document.querySelector('#password'))
          .css('display', 'block');
        angular.element(document.querySelector('#password-eye'))
          .css('color', '')
      }
    }
  }
});
