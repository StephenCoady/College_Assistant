var app = angular.module('collegeApp');


// a controller which allows users to view their current modules and also create new ones
app.controller('allModuleCtrl',
  function ($scope, $rootScope, $location, UserService, $route, NewModuleService, AssignmentService, ModuleService) {
    $scope.module = {};
    $scope.$route = $route;
    var username = $rootScope.username;

    var users = UserService.getUsers()
    for (x in users){
      if (users[x].username === $rootScope.username){
        $scope.loggedInUser = users[x];
      }
    }
    $scope.modules = UserService.getModules($rootScope.user);

    //creates a new module using the NewModuleService
    $scope.newModule = function (){
      NewModuleService.newModule($scope.module);
      alertify.success("Successfully created module: " + $scope.module.title);
      $scope.module = new Module({});
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
  function ($scope, $rootScope, $routeParams, UserService, NewAssignmentService) {

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
  }
});

// a factory service to return either all modules or all modules belonging to the currently logged in user
app.factory('ModuleService', ['$http', '$rootScope', function ($http, $rootScope){
  $rootScope.users = [];
  $rootScope.modules = [];
  $http.get('/api/modules').success(function(moduleData){
    moduleData.forEach(function(data){
      $rootScope.modules.push(data);
    });
  })

  var api = {
    addModule : function(module) {
      return $http.post('/api/modules', module)
    },
    deleteModule : function(module) {
      return $http.delete('/api/modules/'+ module._id)
    },
    updateModule : function(module) {
      return $http.put('/api/modules/' + module._id , module)
    },
    getModules : function(user) {
      return user.modules
    }
  } 
  return api
}]);

//a service to create a new module and push it to a user's arrray of modules
app.service('NewModuleService', function (UserService, ModuleService, $rootScope){
  this.newModule = function(moduleData) {
    ModuleService.addModule(moduleData)
    .success(function(moduleData) {
      UserService.addModule($rootScope.user, moduleData)
      var modules = ModuleService.getModules($rootScope.user) || [];
      modules.push(moduleData);
    })
  }
});

// a model of the module object
function Module(data, modulesLength) {
  this.title = data.title || "",
  this.lecturer = data.lecturer || "",
  this.assignments = data.assignments || []
}