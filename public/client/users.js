var app = angular.module('collegeApp');


//the controller for the user's profile page
app.controller('profileCtrl', function ($scope, $rootScope, $route, UserService) {
  $scope.$route = $route;

  $scope.user = $rootScope.user

  $scope.editUser = function (user){
    UserService.updateUser(user)
    .success(function() {
      $scope.user = user;
      alertify.success("Information Updated!")
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
    getModules : function(user) {
      return user.modules
    },
    addModule : function(user, module) {
      return $http.put('/api/users/' + user._id +'/addToUser', module)
    },
    deleteModule : function(user, module) {
      return $http.delete('/api/users/' + user._id + '/deleteFromUser/' + module._id)
    },
    addAssignment : function(user, moduleId, assignment) {
      return $http.post('/api/users/' + user._id + '/' + moduleId + '/addAssign', assignment)
    },
    updateAssignment : function(user, assignment) {
      return $http.put('/api/users/' + user._id + '/' + assignment.moduleId + '/updateAssign/' + assignment._id, assignment)
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