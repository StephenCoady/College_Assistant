/* this is an app to provide the functionality for a college assistant
 it is built using angular.js
 it is an assignment for Component Development in Applied Computing
 By Stpehen Coady
 */


 var app = angular.module('collegeApp', ['ngRoute'])

 app.config(['$routeProvider',
  function ($routeProvider, $rootScope) {
    $routeProvider
    .when('/', {
      resolve: {
        "check": function($location, $rootScope) {
          if($rootScope.loggedIn){
            $location.path('/dashboard');
          }
        }
      },
      templateUrl: './partials/landing.html'
    })
    .when('/login', {
      templateUrl: './partials/login.html',
      controller: "loginCtrl"
    })
    .when('/modules', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/modules.html',
      controller: "allModuleCtrl",
      activetab: 'modules'
    })
    .when('/assignments', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/assignments.html',
      controller: "allAssignCtrl",
      activetab: 'assignments'
    })
    .when('/modules/:moduleId', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/module-detail.html',
      controller: "moduleCtrl"
    })
    .when('/modules/:moduleId/:assignId', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/assign-detail.html',
      controller: "assignCtrl"
    })
    .when('/signup', {
      templateUrl: './partials/signup.html',
      controller: "NewUserController"
    })
    .when('/dashboard', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/dashboard.html',
      controller: "dashboardCtrl",
      activetab: 'dashboard'
    })
    .when('/profile', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/profile.html',
      controller: "profileCtrl",
      activetab: 'profile'
    })
    .when('/timetable', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/timetable.html',
      controller: "timetableCtrl",
      activetab: 'timetable'
    })
    .otherwise({
      redirectTo: '/'
    });
  }]);


//this is the controller for the landing page, 
//which controls what the user sees when they first visit the app

app.controller('myCtrl', function($scope, $rootScope) {
  $rootScope.loggedIn = false;
  
  $scope.user = {
    role: 'public'
  };

  $scope.logout = function(){
    $scope.user = {
      role: 'public'
    };
    $rootScope.loggedIn = false;
    $rootScope.username = null;
    alertify.success("See you soon!");
  };
});

//the controller to allow logging in fucntionality
app.controller('loginCtrl', function ($scope, $location, $rootScope, UserService) {
  

  $scope.username = "admin"; // set so that it is easy to log in for testing
  $scope.password = "admin";
  
  $scope.submit = function(){
    var usrname = $scope.username;
    var pass = $scope.password;
    var users = UserService.getUsers();
    // UserService.addUsers(users);
    for (x in users) {
      if (users[x].username === $scope.username){
        if(users[x].password === $scope.password){
          var realUser = true;
        }
      }
    };
    
    if(realUser) {
      alertify.success("Successfully logged in!");
      $rootScope.username = $scope.username
      $rootScope.loggedIn = true;
      $location.path('/dashboard');
      if($rootScope.username === 'admin'){

        $scope.user.role = 'admin';
      }


    } else {
      alertify.error("Incorrect username or password.");
    }

  };

});