//app.module.js
angular.module("membermooseApp", ['ngRoute', 'ngStorage', 'ui.bootstrap', 'ngSanitize', 'angularPayments']);

(function (angular) {

  function assignServicesToRootScope($rootScope, auth, session){
    $rootScope.auth = auth;
    $rootScope.session = session;
  }

  // Inject dependencies
  assignServicesToRootScope.$inject = ['$rootScope', 'auth', 'session'];

  // Export
  angular
    .module('membermooseApp')
    .run(assignServicesToRootScope);

})(angular);
