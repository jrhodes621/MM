//funnel.controller.js
angular.module("membermooseApp")
.controller("SignInController", function($scope, $window, $localStorage, auth, session) {
  init = function() {
    $scope.credentails = {};
  };
  $scope.signInClicked = function() {
    auth.logIn($scope.credentials).then(function(response) {
      var user = response.data.user;
      var accessToken = response.data.token;

      session.setUser(user);
      session.setAccessToken(accessToken);

      $window.location = "/dashboard/plans";
    });
  };

  init();
});
