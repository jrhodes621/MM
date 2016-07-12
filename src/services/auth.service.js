(function (angular) {

  function AuthService($http, session, ApiConfig){

    /**
    * Check whether the user is logged in
    * @returns boolean
    */
    this.isLoggedIn = function isLoggedIn(){
      return session.getUser() !== null;
    };

    /**
    * Log in
    *
    * @param credentials
    * @returns {*|Promise}
    */
    this.logIn = function(credentials){
      return $http
        .post(ApiConfig.url + '/sessions', credentials)
        .then(function(response){
          return response;
        });
    };

    /**
    * Log out
    *
    * @returns {*|Promise}
    */
    this.logOut = function(){
      //return $http
        //.get('/api/users/logout')
        //.then(function(response){

          // Destroy session in the browser
          session.destroy();
        //});

    };

  }

  // Inject dependencies
  AuthService.$inject = ['$http', 'session', 'ApiConfig'];

  // Export
  angular
    .module('membermooseApp')
    .service('auth', AuthService);

})(angular);
