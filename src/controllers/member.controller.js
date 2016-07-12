angular.module("membermooseApp")
.controller("MemberController", function($scope, $localStorage, $window, MembersService, member, charges) {
  init = function() {
    $scope.member = member;
    $scope.charges = charges;

    $window.scope = $scope;
  };
  $scope.updateMemberClicked = function() {
    //PlansService.updatePlan($scope.plan).then(function(response) {
      //$scope.plan = response;

      $window.location = "/dashboard/members";
    //});
  };

  init();
});
