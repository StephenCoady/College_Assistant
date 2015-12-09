var app = angular.module('collegeApp');


// a controller which allows users to view their current modules and also create new ones
app.controller('allModuleCtrl',
  function ($scope, $rootScope, $location, UserService, $route, NewModuleService, AssignmentService, ModuleService) {
    $scope.module = {};
    $scope.$route = $route;

    $scope.modules = UserService.getModules($rootScope.user);

    //creates a new module using the NewModuleService
    $scope.newModule = function (){
      var success = NewModuleService.newModule($scope.module);
      if(success){
        alertify.success("Successfully created module: " + $scope.module.title);
        $scope.module = new Module({});
      }
    }

    //delete a module
    $scope.confirmDelete = function(index){
      var module = $scope.modules[index]
      alertify.error("Successfully deleted module: " + $scope.modules[index].title);
      delete $scope.modules[index];
      ModuleService.deleteModule(module);
      UserService.deleteModule($rootScope.user, module);
    }
  });

// a controller which manages a detailed view of a module
app.controller('moduleCtrl', 
  function ($scope, $rootScope, $routeParams, UserService, NewAssignmentService, AssignmentService) {

    $scope.modules = $rootScope.user.modules;
    for (y in $scope.modules){
      if ($scope.modules[y]._id === $routeParams.moduleId){
        $scope.module = $scope.modules[y];
      }
    }
    $rootScope.module = $scope.module;
    $scope.assignments = $scope.module.assignments;

  // to create a new assignment in a module
  $scope.newAssignment = function (){
    alertify.success("New Assignment successfully created.");
    NewAssignmentService.newAssignment($scope.assignment);
    $scope.assignment = new Assignment({});
  }

  // a function to mark an assignment as either complete or still needing work
  $scope.changeAssignment = function(index){

    if ($scope.assignments[index].complete === true){
      $scope.assignments[index].complete = false;
    }
    else{
      $scope.assignments[index].complete = true;
      alertify.success("Whoop, complete!");
    }
    var assignment = $scope.assignments[index];
    AssignmentService.updateAssignment(assignment);
    UserService.updateAssignment($rootScope.user, assignment)
  }
});

// a model of the module object
function Module(data) {
  this.title = data.title || "",
  this.lecturer = data.lecturer || "",
  this.assignments = data.assignments || []
}