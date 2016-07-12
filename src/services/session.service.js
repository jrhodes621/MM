(function (angular) {

  function sessionService($log, $localStorage){

    // Instantiate data when service
    // is loaded
    this._user = null;
    this._accessToken = null;

    try {
      this._user = JSON.parse($localStorage['session.user']);
    } catch(e) {}
    try {
      this._accessToken = $localStorage['session.accessToken'];
    } catch(e) {}

    this.getUser = function(){
      return this._user;
    };

    this.setUser = function(user){
      this._user = user;
      $localStorage['session.user'] = JSON.stringify(user);
      return this;
    };

    this.getAccessToken = function(){
      return this._accessToken;
    };

    this.setAccessToken = function(token){
      this._accessToken = token;
      $localStorage['session.accessToken'] = token;
      return this;
    };

    /**
     * Destroy session
     */
    this.destroy = function destroy(){
      this.setUser(null);
      this.setAccessToken(null);
    };

  }

  // Inject dependencies
  sessionService.$inject = ['$log', '$localStorage'];

  // Export
  angular
    .module('membermooseApp')
    .service('session', sessionService);

})(angular);
