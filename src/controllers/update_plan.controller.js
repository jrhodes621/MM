angular.module("membermooseApp")
.controller("UpdatePlansController", function($scope, $localStorage, $window, PlansService, plan) {
  init = function() {
    $scope.plan = plan;

    $window.scope = $scope;
  };
  $scope.updatePlanClicked = function() {
    PlansService.updatePlan($scope.plan).then(function(response) {
      $scope.plan = response;

      $window.location = "/dashboard/plans";
    });
  };

  init();
});
