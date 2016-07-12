angular.module("membermooseApp")
.config(function($httpProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.interceptors.push(function($q, $location, $localStorage, session) {
      return {
        'request': function (config) {
          config.headers = config.headers || {};
          if (session.getAccessToken()) {
              config.headers["x-access-token"] = session.getAccessToken();
          }
          return config;
        },
        'responseError': function(response) {
          if(response.status === 401 || response.status === 403) {
              $location.path('/users/sign_in');
          }
          return $q.reject(response);
        }
      };
    });
  });
