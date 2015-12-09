var app = angular.module('collegeApp');

// a service to create a user
app.service('NewUserService', function (UserService, $http){
  this.registerUser = function(userData) {
    UserService.addUser(userData)
    .success(function(userData) {
      var users = UserService.getUsers() || [];
      users.push(userData);
      return true;
    })
    .error(function(error) {
      if(error.name === 'MongoError'){
        if(error.err.indexOf('email') > -1){
          alertify.error('Email is already used!')
        }
      }
      if(error.name === 'MongoError'){
        if(error.err.indexOf('username') > -1){
          alertify.error('Username is taken!')
        }
      }
      if(error.name === 'ValidationError'){
        if(error.errors.password!= undefined){
          alertify.error(error.errors.password.message)
        }
        else{
          alertify.error("Please ensure all fields are filled in!")
        }
      }
      return false;
    });
  }
});

// a factory service to get a user's timetable.
app.factory('TimetableService', ['$http', '$rootScope', '$routeParams', function ($http, $rootScope, $routeParams){
  $rootScope.timetable = [];
  var api = {
   getTimetable : function() {
    $rootScope.timetable = $rootScope.user.timetable;
    return $rootScope.timetable;
  }
}
return api
}]);

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
      return true;
    })
    .error(function(error) {
      alertify.error("Please ensure all fields are filled in!")
      return false;
    });
  }
});

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

// a factory service to return all assignments currently belonging to a specific module.
app.factory('AssignmentService', ['$http', '$rootScope', '$routeParams', function ($http, $rootScope, $routeParams){

  $rootScope.assignments = [];
  var api = {
    getAssignments : function() {
      for (y in $rootScope.modules){
        if ($rootScope.modules[y]._id === $routeParams.moduleId){
          var module = $rootScope.modules[y];
          // $rootScope.module = module;
        }
      }
      $rootScope.assignments = module.assignments;
      return $rootScope.assignments;
    },
    addAssignment : function(assignment) {
      return $http.post('/api/assignments', assignment)
    },
    updateAssignment : function(assignment) {
      return $http.put('/api/assignments/' + assignment._id, assignment)
    }
  }
  return api;
}]);

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
    login : function(username, password) {
      return $http.get('/api/users/login', {params:{"username": username, "password": password}})
    },
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