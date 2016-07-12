//funnel.controller.js
angular.module("membermooseApp")
.controller("PlansController", function($scope, $localStorage, $window, plans) {
  init = function() {
    $scope.plans = plans.data;

    $window.scope = $scope;
  };

  init();
});
