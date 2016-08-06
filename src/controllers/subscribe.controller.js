//subscribe.controller.js
angular.module("membermooseApp")
.controller("SubscribeController", function($scope, $localStorage, $window, SubscribeService) {
  init = function() {
    $window.Stripe.setPublishableKey("pk_test_4WpPoyEVIDzw8SkqQ6w0kRSq");
    $scope.plan_id = $window.plan_id;
    $window.scope = $scope;
  };

  $scope.handleStripe = function(status, response) {
    console.log(status);
    console.log(response);
    var plan_id = $scope.plan_id;
    var first_name = $scope.first_name;
    var last_name = $scope.last_name;
    var email_address = $scope.email_address;
    var password = $scope.password;

    if(response.error) {
      // there was an error. Fix it.
    } else {
      var token = response.id;

      var data = {
        token: token,
        plan_id: plan_id,
        first_name: first_name,
        last_name: last_name,
        email_address: email_address,
        password: password
      };

      SubscribeService.createSubscription(data).then(function(response) {
        console.log(response);

        $window.location = "/dashboard/plans";
      });
    }
  };

  init();
});
