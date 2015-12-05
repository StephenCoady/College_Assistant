var app = angular.module('collegeApp')


//a controller for all assignments in a user's module array
app.controller('allAssignCtrl',
  function ($scope, $rootScope, UserService, $route) {
    $scope.$route = $route;
    var modules = [];
    $scope.modules = [];
    modules = UserService.getModules();
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
  $rootScope.modules = UserService.getModules();
  this.newAssignment = function(assignmentData) {
    var assignments = AssignmentService.getAssignments() || [];
    assignments.push(new Assignment(assignmentData, assignments.length, $routeParams.moduleId));
  }
});

// controls the assignment detail view. lists assignments and provides functionality to alter them 
app.controller('assignCtrl', function ($scope, $rootScope, $routeParams, UserService) {
 var users = UserService.getUsers();
 $scope.users = UserService.getUsers();
 for (x in $scope.users){
   if ($scope.users[x].username === $rootScope.username){
    $scope.modules = $scope.users[x].modules;
    for (y in $scope.modules){
      if ($scope.modules[y].id === $routeParams.moduleId){
        $scope.assignments = $scope.modules[y].assignments;
        $scope.module = $scope.modules[y];
        $scope.assignment = $scope.assignments[$routeParams.assignId-1];
      }
    }
  }
}

$scope.editAssignment = function (assignment){
  $scope.assignment = assignment;
  alertify.success("Assignment Updated!")
}
});

// a factory service to return all assignments currently belonging to a specific module.
app.factory('AssignmentService', ['$http', '$rootScope', '$routeParams', function ($http, $rootScope, $routeParams){

  $rootScope.assignments = [];
  var api = {
    getAssignments : function() {
      for (y in $rootScope.modules){
        if ($rootScope.modules[y].id === $routeParams.moduleId){
          var module = $rootScope.modules[y];
          // $rootScope.module = module;
        }
      }
      $rootScope.assignments = module.assignments;
      return $rootScope.assignments;
    }
  }
  return api;
}]);

// a model of the assignment object
function Assignment(data, assignmentsLength, moduleId) {
  this.title = data.title || "",
  this.snippet = data.snippet || "",
  this.date = data.date || "",
  this.moduleId = moduleId || "",
  this.complete = data.complete || false,
  this.id = (assignmentsLength+1).toString() || "",
  this.details = data.details || ""
}