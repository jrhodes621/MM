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

angular.module("membermooseApp")
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $routeProvider
      .when("/users/sign_in", {
        templateUrl: "/partials/users/sign_in.jade",
        controller: "SignInController",
      })
      .when("/users/sign_up", {
        templateUrl: "/partials/users/sign_up.jade",
        controller: "SignUpController",
      })
      .when("/subscribe/:plan_id", {
        controller: "SubscribeController",
        resolve: {
          plan: function($route, PlansService) {
            return PlansService.getPlan($route.current.params.plan_id);
          }
        }
      })
      .when("/dashboard/account", {
        templateUrl: "/partials/dashboard/account.jade",
        controller: "AccountController",
      })
      .when("/dashboard/launch", {
        templateUrl: "/partials/dashboard/launch_list.jade",
        controller: "LaunchListController",
      })
      .when("/dashboard/members", {
        templateUrl: "/partials/dashboard/members.jade",
        controller: "MembersController",
        resolve: {
          members: function(MembersService) {
              return MembersService.getMembers();
          }
        },
      })
      .when("/dashboard/members/:member_id", {
        templateUrl: "/partials/dashboard/member.jade",
        controller: "MemberController",
        resolve: {
          member: function($route, MembersService) {
              return MembersService.getMember($route.current.params.member_id);
          },
          charges: function($route, MembersService) {
              return MembersService.getCharges($route.current.params.member_id);
          }
        },
      })
      .when("/dashboard/plans", {
        templateUrl: "/partials/dashboard/plans.jade",
        controller: "PlansController",
        resolve: {
          plans: function(PlansService) {
              return PlansService.getPlans();
          }
        },
      })
      .when("/dashboard/plans/:plan_id", {
        templateUrl: "/partials/dashboard/edit_plan.jade",
        controller: "UpdatePlansController",
        resolve: {
          plan: function($route, PlansService) {
              return PlansService.getPlan($route.current.params.plan_id);
          }
        },
      })
      .when("/dashboard/plans/new", {
        templateUrl: "/partials/dashboard/new_plans.jade",
        controller: "NewPlanController",
      })
      .otherwise({
          redirectTo: "/"
      });
  });

//funnel.service.js
angular.module("membermooseApp")
.constant('ApiConfig', {
  url: '/api'
});

//funnel.controller.js
angular.module("membermooseApp")
.controller("DashboardController", function($scope, session, auth, $window) {
  init = function() {
    $scope.user = session.getUser();
  };
  logoutClicked = function() {
    auth.logout();
  };
  init();
});

//funnel.controller.js
angular.module("membermooseApp")
.controller("FunnelController", function($scope, $localStorage, FunnelService, $window) {
  init = function() {
    $scope.step = 1;
    $scope.user = {
      name: "",
      company_name: "",
      email_address: "",
      password: ""
    };
    $window.scope = $scope;
  };
  $scope.nextClicked = function() {
    switch ($scope.step) {
      case 1:
        FunnelService.submitStep1({"name": $scope.user.name}).then(function(doc) {
          var token = doc.data.token;

          if(token) {
            $scope.step = 2;
          }
        });

        break;
      case 2:
        FunnelService.submitStep2({"company_name": $scope.user.company_name}).then(function(doc) {
          $scope.step = 3;
        });

        break;
      case 3:
        FunnelService.submitStep3({"email_address": $scope.user.email_address, "password": $scope.user.password}).then(function(doc) {
          $window.location = "/dashboard/launch";
        });

        break;
    }
  };

  init();
});

//funnel.controller.js
angular.module("membermooseApp")
.controller("LaunchListController", function($scope, $localStorage, $window) {
  init = function() {

  };

  init();
});

angular.module("membermooseApp")
.controller("MemberController", function($scope, $localStorage, $window, MembersService, member, charges) {
  init = function() {
    $scope.member = member;
    $scope.charges = charges;

    $window.scope = $scope;
  };
  $scope.updateMemberClicked = function() {
    //PlansService.updatePlan($scope.plan).then(function(response) {
      //$scope.plan = response;

      $window.location = "/dashboard/members";
    //});
  };

  init();
});

//funnel.controller.js
angular.module("membermooseApp")
.controller("MembersController", function($scope, $localStorage, $window, members) {
  init = function() {
    $scope.members = members.data;
  };

  init();
});

angular.module("membermooseApp")
.controller("NewPlanController", function($scope, $localStorage, $window, PlansService) {
  init = function() {
    $scope.plan = {};

    $window.scope = $scope;
  };
  $scope.createPlanClicked = function() {
    PlansService.createPlan($scope.plan).then(function(response) {
      $scope.plan = response.data;

      $window.location = "/dashboard/plans";
    });
  };

  init();
});

//funnel.controller.js
angular.module("membermooseApp")
.controller("PlansController", function($scope, $localStorage, $window, plans) {
  init = function() {
    $scope.plans = plans.data;

    $window.scope = $scope;
  };

  init();
});

//funnel.controller.js
angular.module("membermooseApp")
.controller("SignInController", function($scope, $window, $localStorage, auth, session) {
  init = function() {
    $scope.credentials = {
      email_address: ""
    };
  };
  $scope.signInClicked = function() {
    auth.logIn($scope.credentials).then(function(response) {
      var user = response.data.user;
      var accessToken = response.data.token;

      session.setUser(user);
      session.setAccessToken(accessToken);

      $window.location = "/dashboard/plans";
    });
  };

  init();
});

//sign_up.controller.js
angular.module("membermooseApp")
.controller("SignUpController", function($scope, $localStorage, $window, UsersService, session) {
  init = function() {
    $scope.user = {
      first_name: "",
      last_name: "",
      company_name: "",
      email_address: "",
      password: ""
    };
  };
  $scope.signUpClicked = function() {
    if($scope.user.password != $scope.confirm_password) {
      console.log("Password and confirm password don't match");

      return;
    }
    UsersService.createUser($scope.user).then(function(response) {
      var user = response.data.user;
      var accessToken = response.data.token;

      session.setUser(user);
      session.setAccessToken(accessToken);

      $window.location = "/dashboard/launch";
    });
  };

  init();
});

//subscribe.controller.js
angular.module("membermooseApp")
.controller("SubscribeController", function($scope, $localStorage, $window, SubscribeService) {
  init = function() {
    $window.Stripe.setPublishableKey("pk_test_4WpPoyEVIDzw8SkqQ6w0kRSq");
    $scope.plan_id = $window.plan_id;
    $window.scope = $scope;
  };

  $scope.handleStripe = function(status, response) {
    console.log(status);
    console.log(response);
    var plan_id = $scope.plan_id;
    var first_name = $scope.first_name;
    var last_name = $scope.last_name;
    var email_address = $scope.email_address;
    var password = $scope.password;

    if(response.error) {
      // there was an error. Fix it.
    } else {
      var token = response.id;

      var data = {
        token: token,
        plan_id: plan_id,
        first_name: first_name,
        last_name: last_name,
        email_address: email_address,
        password: password
      };

      SubscribeService.createSubscription(data).then(function(response) {
        console.log(response);

        $window.location = "/dashboard/plans";
      });
    }
  };

  init();
});

angular.module("membermooseApp")
.controller("UpdatePlansController", function($scope, $localStorage, $window, PlansService, plan) {
  init = function() {
    $scope.plan = plan;

    $window.scope = $scope;
  };
  $scope.updatePlanClicked = function() {
    PlansService.updatePlan($scope.plan).then(function(response) {
      $scope.plan = response;

      $window.location = "/dashboard/plans";
    });
  };

  init();
});

angular.module("membermooseApp")
.filter('encodeURIComponent', function() {
    return window.encodeURIComponent;
});

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
