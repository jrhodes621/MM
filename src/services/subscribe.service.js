//subscribe.service.js
angular.module("membermooseApp")
.service("SubscribeService", function($http, ApiConfig) {
  this.createSubscription = function(data) {
    return $http.post(ApiConfig.url + "/subscribe", data).
      then(function(response) {
        return response;
      });
    };
  });
