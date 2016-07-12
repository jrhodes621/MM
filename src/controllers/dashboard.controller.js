//funnel.controller.js
angular.module("membermooseApp")
.controller("DashboardController", function($scope, session, auth, $window) {
  init = function() {
    $scope.user = session.getUser();
  };
  logoutClicked = function() {
    auth.logout();
  };
  init();
});
