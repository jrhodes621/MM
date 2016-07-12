//users.service.js
angular.module("membermooseApp")
.service("UsersService", function($http, ApiConfig) {
  this.createUser = function(data) {
    return $http.post(ApiConfig.url + "/users", data).
      then(function(response) {
        return response;
      });
    };
  });
