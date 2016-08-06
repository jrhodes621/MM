//plans.service.js
angular.module("membermooseApp")
.service("PlansService", function($http, ApiConfig, session) {
  this.getPlans = function(data) {
    return $http.get(ApiConfig.url + "/plans").
      then(function(response) {
        return response.data;
      });
    };
  this.getPlan = function(plan_id) {
    return $http.get(ApiConfig.url + "/plans/" + encodeURIComponent(plan_id)).
      then(function(response) {
        return response.data;
      });
    };
  this.createPlan = function(data) {
    return $http.post(ApiConfig.url + "/plans", data).
      then(function(response) {
        return response.data;
      });
  };
  this.updatePlan = function(data) {
    return $http.put(ApiConfig.url + "/plans/" + data.id, data).
      then(function(response) {
        return response.data;
      });
  };
});
