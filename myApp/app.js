var app = angular.module('collegeApp', ['ngRoute'])

app.config(['$routeProvider',
      function($routeProvider) {
        $routeProvider
          .when('/', {
            templateUrl: './partials/landing.html'
          })
          .when('/login', {
            templateUrl: './partials/login.html'
          })
          .when('/signup', {
            templateUrl: './partials/signup.html'
          })
          .when('/dashboard',{
            templateUrl: './partials/dashboard.html'
          })
          .otherwise({
            redirectTo: '/'
          });
      }]);

app.controller('myCtrl', function($scope) {
    $scope.user = {
        role: 'public'
      };
      $scope.logout = function(){
        $scope.user ={
          role: 'public'
        }
      };
});

app.controller('loginCtrl', function($scope, $location, $rootScope, $http) {
      
      $http.get("http://localhost:8080/myApp/database.json")
      .success(function(response){
        $scope.persons = response.records;
      });

      $scope.submit = function(){
        var usrname = $scope.username;
        var pass = $scope.password;

          if($scope.username == 'admin' && $scope.password == 'admin') {
            $scope.user.role = 'admin';
            $location.path('/dashboard');
          } else {
            alert("Incorrect username or password.");
          }
      };

  });