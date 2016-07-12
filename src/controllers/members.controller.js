//funnel.controller.js
angular.module("membermooseApp")
.controller("MembersController", function($scope, $localStorage, $window, members) {
  init = function() {
    $scope.members = members.data;
  };

  init();
});
