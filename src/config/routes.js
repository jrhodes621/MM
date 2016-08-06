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
