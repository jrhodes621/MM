//sign_up.controller.js
angular.module("membermooseApp")
.controller("SignUpController", function($scope, $localStorage, $window, UsersService, session) {
  init = function() {
    $scope.user = {
      first_name: "",
      last_name: "",
      company_name: "",
      email_address: "",
      password: ""
    };
  };
  $scope.signUpClicked = function() {
    if($scope.user.password != $scope.confirm_password) {
      console.log("Password and confirm password don't match");

      return;
    }
    UsersService.createUser($scope.user).then(function(response) {
      var user = response.data.user;
      var accessToken = response.data.token;

      session.setUser(user);
      session.setAccessToken(accessToken);

      $window.location = "/dashboard/launch";
    });
  };

  init();
});
