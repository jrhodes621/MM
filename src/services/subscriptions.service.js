//subscriptions.service.js
angular.module("membermooseApp")
.service("SubscriptionsService", function($http, ApiConfig, session) {
  this.createSubscription = function(data) {
    return $http.post(ApiConfig.url + "/subscriptions").
      then(function(response) {
        return response.data;
      });
    };
  this.cancelSubscriptiion = function(subscription_id) {
    return $http.delete(ApiConfig.url + "/subscriptions/" + subscription_id).
      then(function(response) {
        return response.data;
      });
    };
});
