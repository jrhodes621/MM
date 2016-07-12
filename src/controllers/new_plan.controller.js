angular.module("membermooseApp")
.controller("NewPlanController", function($scope, $localStorage, $window, PlansService) {
  init = function() {
    $scope.plan = {};

    $window.scope = $scope;
  };
  $scope.createPlanClicked = function() {
    PlansService.createPlan($scope.plan).then(function(response) {
      $scope.plan = response.data;

      $window.location = "/dashboard/plans";
    });
  };

  init();
});
