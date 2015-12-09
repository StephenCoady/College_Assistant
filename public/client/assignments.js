var app = angular.module('collegeApp')


//a controller for all assignments in a user's module array
app.controller('allAssignCtrl',
  function ($scope, $rootScope, UserService, $route) {
    $scope.$route = $route;
    var modules = [];
    $scope.modules = [];
    modules = UserService.getModules($rootScope.user);
    var assignments = [];
    for (x in modules){
      for (y in modules[x].assignments){
        assignments.push(modules[x].assignments[y])
      }
    }
    $scope.assignments = assignments;
    $scope.modules[0] = {};
    $scope.modules.push.apply($scope.modules, modules);
  }
  );

// a service to create the new assignment. called from the moduleCtrl controller
app.service('NewAssignmentService', function (AssignmentService, $rootScope, UserService, $routeParams){
  $rootScope.users = UserService.getUsers();
  $rootScope.modules = UserService.getModules($rootScope.user);
  this.newAssignment = function(assignmentData) {
    assignmentData.moduleId = $routeParams.moduleId;
    assignmentData.complete = false;
    AssignmentService.addAssignment(assignmentData)
    .success(function(assignmentData) {
      UserService.addAssignment($rootScope.user, assignmentData.moduleId, assignmentData)
      var assignments = AssignmentService.getAssignments() || [];
      assignments.push(assignmentData);
    })
  }
});

// controls the assignment detail view. lists assignments and provides functionality to alter them 
app.controller('assignCtrl', function ($scope, $rootScope, $routeParams, UserService, AssignmentService) {


  var modules = $rootScope.user.modules;
  for (y in modules){
    if (modules[y]._id === $routeParams.moduleId){
      var assignments =  modules[y].assignments;
      for (x in assignments){
        if (assignments[x]._id === $routeParams.assignId){
          $scope.assignment = assignments[x];
        }
      }
    }
  }


  $scope.editAssignment = function (assignment){
    $scope.assignment = assignment;
    debugger;
    AssignmentService.updateAssignment(assignment);
    UserService.updateAssignment($rootScope.user, assignment)
    alertify.success("Assignment Updated!")
  }
});

// a model of the assignment object
function Assignment(data, moduleId) {
  this.title = data.title || "",
  this.snippet = data.snippet || "",
  this.date = data.date || "",
  this.moduleId = moduleId || "",
  this.complete = false,
  this.details = data.details || ""
}