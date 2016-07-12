//funnel.controller.js
angular.module("membermooseApp")
.controller("FunnelController", function($scope, $localStorage, FunnelService, $window) {
  init = function() {
    $scope.step = 1;
    $scope.user = {
      name: "",
      company_name: "",
      email_address: "",
      password: ""
    };
    $window.scope = $scope;
  };
  $scope.nextClicked = function() {
    switch ($scope.step) {
      case 1:
        FunnelService.submitStep1({"name": $scope.user.name}).then(function(doc) {
          var token = doc.data.token;

          if(token) {
            $scope.step = 2;
          }
        });

        break;
      case 2:
        FunnelService.submitStep2({"company_name": $scope.user.company_name}).then(function(doc) {
          $scope.step = 3;
        });

        break;
      case 3:
        FunnelService.submitStep3({"email_address": $scope.user.email_address, "password": $scope.user.password}).then(function(doc) {
          $window.location = "/dashboard/launch";
        });

        break;
    }
  };

  init();
});
