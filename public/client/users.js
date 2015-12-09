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