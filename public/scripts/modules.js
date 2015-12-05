var app = angular.module('collegeApp');


// a controller which allows users to view their current modules and also create new ones
app.controller('allModuleCtrl',
  function ($scope, $rootScope, $location, UserService, $route, NewModuleService, AssignmentService) {
    $scope.module = {};
    $scope.$route = $route;
    var username = $rootScope.username;

    var users = UserService.getUsers()
    for (x in users){
      if (users[x].username === $rootScope.username){
        $scope.loggedInUser = users[x];
      }
    }
    $scope.modules = UserService.getModules();

    //creates a new module using the NewModuleService
    $scope.newModule = function (){
      NewModuleService.newModule($scope.module);
      alertify.success("Successfully created module: " + $scope.module.title);
      $scope.module = new Module({});
    }

    //delete a module
    $scope.confirmDelete = function(index){
      alertify.error("Successfully deleted module: " + $scope.modules[index].title);
      delete $scope.modules[index];
    }
  });

// a controller which manages a detailed view of a module
app.controller('moduleCtrl', 
  function ($scope, $rootScope, $routeParams, UserService, NewAssignmentService) {
   var users = UserService.getUsers();
   for (x in users){
     if (users[x].username === $rootScope.username){
      $scope.modules = users[x].modules;
      for (y in $scope.modules){
        if ($scope.modules[y].id === $routeParams.moduleId){
          $scope.module = $scope.modules[y];
        }
      }
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
  }
});

//a service to create a new module and push it to a user's arrray of modules
app.service('NewModuleService', function (UserService){
  this.newModule = function(moduleData) {
    var modules = UserService.getModules() || [];
    modules.push(new Module(moduleData, modules.length));
  }


// a model of the module object
function Module(data, modulesLength) {
  this.id = (modulesLength+1).toString() || "",
  this.title = data.title || "",
  this.lecturer = data.lecturer || "",
  this.assignments = data.assignments || []
}
});