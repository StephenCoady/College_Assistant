var app = angular.module('collegeApp')

//controls the dashboard. most of this controller is utilised by the admin account.
app.controller('dashboardCtrl', function ($scope, $rootScope, $location, UserService, $route) {
  $scope.$route = $route;
  var username = $rootScope.username;
  $scope.modules = UserService.getModules();
  $scope.users = UserService.getUsers()
  for (x in $scope.users){
    if ($scope.users[x].username === $rootScope.username){
      $scope.loggedInUser = $scope.users[x];
      $rootScope.user = $scope.users[x];
    }
  }

  $scope.assignCount = 0;

  for (x in $scope.loggedInUser.modules){
    for (y in $scope.loggedInUser.modules[x].assignments){
      if(!$scope.loggedInUser.modules[x].assignments[y].complete){
        $scope.assignCount += 1;
      }
    }
  }

  //the following functions in this controller are used only by 
  //the administrator when they are editing users
  $scope.editUser = function(user) {
    user.oldFirstName = user.firstName;
    user.oldSecondName = user.secondName;
    user.oldEmail = user.email;
    user.oldUsername = user.username;
    user.oldPassword = user.password;
    user.oldAge = user.age;
    user.oldCourse = user.course;
    user.state = "edit";
  }

  $scope.deleteUser = function(user) {
    user.state = "deleted";
  }

  $scope.confirmDelete = function(index) {
    if ($scope.users[index].state == "deleted") {
      UserService.deleteUser($scope.users[index]._id)
      .success(function() {
        $scope.users.splice(index, 1);
      });
    }
  }

  $scope.undoDelete = function(user) {
   user.state = "normal";
 }

 $scope.saveUser = function(user) {
  UserService.updateUser(user)
    .success(function() {
      user.state = "normal";
    });
}

$scope.cancelEdit = function (user) {
  user.firstName = user.oldFirstName;
  user.secondName = user.oldSecondName;
  user.email = user.oldEmail;
  user.username = user.oldUsername;
  user.password = user.oldPassword;
  user.age = user.oldAge;
  user.course = user.oldCourse;
  user.state = "normal";
}

})