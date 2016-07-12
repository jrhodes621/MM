//funnel.service.js
angular.module("membermooseApp")
.service("FunnelService", function($http, ApiConfig, session) {
  this.submitStep1 = function(data) {
    return $http.post(ApiConfig.url + "/funnel/step1", data).
      then(function(response) {
        var user = response.data.user;
        var accessToken = response.data.token;

        session.setUser(user);
        session.setAccessToken(accessToken);

        return response;
      });
    };
  this.submitStep2 = function(data) {
    return $http.post(ApiConfig.url + "/funnel/step2", data).
      then(function(response) {
        var user = response.data;

        session.setUser(user);

        return response;
      });
    };
  this.submitStep3 = function(data) {
    return $http.post(ApiConfig.url + "/funnel/step3", data).
      then(function(response) {
        var user = response.data;

        session.setUser(user);

        return response;
      });
    };
});
