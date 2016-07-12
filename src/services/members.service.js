//plans.service.js
angular.module("membermooseApp")
.service("MembersService", function($http, ApiConfig, session) {
  this.getMembers = function(data) {
    return $http.get(ApiConfig.url + "/members").
      then(function(response) {
        return response.data;
      });
    };
    this.getMember = function(member_id) {
      return $http.get(ApiConfig.url + "/members/" + member_id).
        then(function(response) {
          return response.data;
        });
      };
    this.getCharges = function(member_id) {
      return $http.get(ApiConfig.url + "/members/" + member_id + "/charges").
        then(function(response) {
          return response.data;
        });
      };
  });
