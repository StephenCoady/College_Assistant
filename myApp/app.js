var app = angular.module('collegeApp', ['ngRoute'])

app.config(['$routeProvider',
      function($routeProvider, $rootScope) {
        $routeProvider
          .when('/', {
            templateUrl: './partials/landing.html'
          })
          .when('/login', {
            templateUrl: './partials/login.html',
            controller: "loginCtrl"
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
            controller: "dashboardCtrl"
          })
          .otherwise({
            redirectTo: '/'
          });
      }]);

app.controller('myCtrl', function($scope, $rootScope) {
    $rootScope.loggedIn = false;

      $scope.logout = function(){
        $rootScope.loggedIn = false;
      };
});

app.controller('loginCtrl', function($scope, $location, $rootScope, $http, UserService) {
      
      $scope.submit = function(){
        var usrname = $scope.username;
        var pass = $scope.password;

          $scope.users = UserService.getUsers();

          for (x in $scope.users) {
              if ($scope.users[x].username === $scope.username){
                if($scope.users[x].password === $scope.password){
                  var realUser = true;
                }
              }
          }
          if(realUser){
          alert("Success!")
        }

        if(realUser) {
            $rootScope.username = $scope.username
            $rootScope.loggedIn = true;
            $location.path('/dashboard');
          } else {
            alert("Incorrect username or password.");
          }
        
      };

  });

// app.controller('signUpCtrl', function($scope, $location, $rootScope, $http, UserService, NewUserService) {
//     $scope.signup = function(){
//       var firstName = $scope.firstName;
//       var secondName = $scope.secondName;
//       var age = $scope.age;
//       var email = $scope.email;
//       var usrname = $scope.username;
//       var pass = $scope.password;
//       var pass2 = $scope.password2;

//       UserService.getUsers().success(function(data) {
//         $scope.users = data;
//         var logMeIn = true;
//         for (x in $scope.users) {
//               if ($scope.users[x].username === $scope.username){
//                 alert("Sorry, username already taken.")
//                 logMeIn = false;
//                 break;
//               }
//               else {
//                 if(pass != pass2){
//                   alert("Sorry, passwords do not match.")
//                   logMeIn = false;
//                   break;
//                 }
//               }
//           }
//           if (logMeIn){
//             var user = new User(userData);
//             NewUserService.registerUser($scope.user); 
//             $scope.users.push(user);
//             $rootScope.username = $scope.username;
//             $rootScope.loggedIn = true;
//             $location.path('/dashboard');
//             $rootScope.users = $scope.users;
//           }
//       })
//     }
//   });

app.controller('dashboardCtrl', 
  ['$scope', '$rootScope', '$location', 'UserService',
    function($scope, $rootScope, $location, UserService) {
      var username = $rootScope.username;

      $scope.users = UserService.getUsers()
        for (x in $scope.users){
          if ($scope.users[x].username === $rootScope.username){
            $scope.loggedInUser = $scope.users[x];
          }
        }
        
        $scope.modules = $scope.loggedInUser.modules;
      
  }])

app.service('NewUserService', function(UserService){
 var users = UserService.getUsers() || [];
  this.registerUser = function(userData) {
    users.push(new User(userData));
 // return users;
  }
});

app.controller('NewUserController', function($scope, NewUserService, $location, $rootScope){
  $scope.registerUser = function() {
    NewUserService.registerUser($scope.user);
    $rootScope.username = $scope.user.username;
    $scope.user = new User({});
    $rootScope.loggedIn = true;
    $location.path('/dashboard')
  }
});

function User(data) {
  this.firstName = data.firstName || "",
  this.secondName = data.secondName || "",
  this.email = data.email || "",
  this.username = data.username || "",
  this.password = data.password || "",
  this.age = data.age || "",
  this.modules = data.modules || []
}

app.factory('UserService', ['$http' , function($http){
            var users = [];
            $http.get('users.json').success(function(userData){
                      userData.forEach(function(data){
                        users.push(new User(data));
                      });
                    })
            var api = {
                getUsers : function() {
                         return users;      
                }
            }
            return api
        }])