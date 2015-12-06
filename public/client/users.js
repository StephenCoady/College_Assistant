var app = angular.module('collegeApp');

// a contoller which handles the signing up of new users.
app.controller('NewUserController', function ($scope, NewUserService, $location, $rootScope, UserService){

  $scope.registerUser = function() {
    var users = UserService.getUsers();
    var signup = true; // if this variable is still true by the end of this function, then the user may sign up

    if($scope.user.firstName === undefined || 
      $scope.user.secondName === undefined ||
      $scope.user.age === undefined ||
      $scope.user.email === undefined ||
      $scope.user.username === undefined ||
      $scope.user.password === undefined ||
      $scope.user.password2 === undefined
      )
    {
      alertify.error("Sorry, all fields must be filled in.")
      signup = false;
    }

    for (x in users){
      if (users[x].username === $scope.user.username){
        alertify.error("Sorry, that username is already taken.")
        signup = false;
        break;
      }
      if ($scope.user.password !== $scope.user.password2){
        alertify.error("Sorry, your passwords must match.")
        signup = false;
        break;
      }
      if (users[x].email === $scope.user.email){
        alertify.error("Sorry, that email is already in use.")
        signup = false;
        break;
      }
    }
    if (signup) {
      NewUserService.registerUser($scope.user);
      users.push($scope.user);
      alertify.success("Welcome, " + $scope.user.firstName + "!");
      $rootScope.username = $scope.user.username;
      $scope.user = new User({});
      $rootScope.loggedIn = true;
      $location.path('/dashboard');
    }

  }
});

//the controller for the user's profile page
app.controller('profileCtrl', function ($scope, $rootScope, $route, UserService) {
  $scope.$route = $route;

  var users = UserService.getUsers()
  for (x in users){
    if (users[x].username === $rootScope.username){
      $scope.user = users[x];
    }
  }

  $scope.editUser = function (user){
    UserService.updateUser(user)
    .success(function() {
      $scope.user = user;
      alertify.success("Information Updated!")
    });
  }
});

// a service to create a user
app.service('NewUserService', function (UserService, $http){
  this.registerUser = function(userData) {
    UserService.addUser(userData)
    .success(function(userData) {
      var users = UserService.getUsers() || [];
      //var user = new User(userData)
      users.push(userData);
    });
  }
});

// a factory service to return either all users or all modules belonging to the currently logged in user
app.factory('UserService', ['$http', '$rootScope', function ($http, $rootScope){
  $rootScope.users = [];
  $rootScope.modules = [];
  $http.get('/api/users').success(function(userData){
    userData.forEach(function(data){
      $rootScope.users.push(data);
    });
  })

  var api = {
    addUsers : function() {
      return $http.post('/api/users', $rootScope.users)
    },
    addUser : function(user) {
      return $http.post('/api/users', user)
    },
    deleteUser : function(userID) {
      return $http.delete('/api/users/'+ userID)
    },
    getUsers : function() {
      return $rootScope.users
    },
    getLoggedInUser : function() {
      return $rootScope.user
    },
    updateUser : function(user) {
      return $http.put('/api/users/' + user._id , user)
    },
    getModules : function() {
      for (x in $rootScope.users){
        if ($rootScope.users[x].username === $rootScope.username){
          var user = $rootScope.users[x];
        }
      }
      $rootScope.modules = user.modules;
      return $rootScope.modules
    },
    addModule : function(user, module) {
      return $http.post('/api/users/' + user._id, module)
    }
  } 
  return api
}]);

// a model of the user object
function User(data) {
  this.firstName = data.firstName || "",
  this.secondName = data.secondName || "",
  this.email = data.email || "",
  this.username = data.username || "",
  this.password = data.password || "",
  this.age = data.age || "",
  this.course = data.course || "",
  this.timetable = data.timetable || new Timetable(),
  this.modules = data.modules || []
}