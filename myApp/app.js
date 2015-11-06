var app = angular.module('collegeApp', ['ngRoute'])

app.config(['$routeProvider',
  function ($routeProvider, $rootScope) {
    $routeProvider
    .when('/', {
      templateUrl: './partials/landing.html'
    })
    .when('/login', {
      templateUrl: './partials/login.html',
      controller: "loginCtrl"
    })
    .when('/modules', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/modules.html',
      controller: "allModuleCtrl",
      activetab: 'modules'
    })
    .when('/assignments', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/assignments.html',
      controller: "allAssignCtrl",
      activetab: 'assignments'
    })
    .when('/modules/:moduleId', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/module-detail.html',
      controller: "moduleCtrl"
    })
    .when('/modules/:moduleId/:assignId', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/assign-detail.html',
      controller: "assignCtrl"
    })
    .when('/signup', {
      templateUrl: './partials/signup.html',
      controller: "NewUserController"
    })
    .when('/dashboard', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/dashboard.html',
      controller: "dashboardCtrl",
      activetab: 'dashboard'
    })
    .when('/profile', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/profile.html',
      controller: "profileCtrl",
      activetab: 'profile'
    })
    .otherwise({
      redirectTo: '/'
    });
  }]);

app.controller('myCtrl', function($scope, $rootScope) {
  $rootScope.loggedIn = false;

  $scope.logout = function(){
    $rootScope.loggedIn = false;
    $rootScope.username = null;
  };
});

app.controller('profileCtrl', function($scope, $rootScope, $route) {
  $scope.route = $route;
});

app.controller('loginCtrl', function($scope, $location, $rootScope, $http, UserService) {
  $scope.username = "admin";
  $scope.password = "admin";
  $scope.submit = function(){
    var usrname = $scope.username;
    var pass = $scope.password;

    var users = UserService.getUsers();

    for (x in users) {
      if (users[x].username === $scope.username){
        if(users[x].password === $scope.password){
          var realUser = true;
        }
      }
    }
    if(realUser){
      alert("Success!")
    }

    if(realUser) {
      $rootScope.username = $scope.username

      $rootScope.loggedIn = true;
      $location.path('/dashboard');


    } else {
      alert("Incorrect username or password.");
    }

  };

});

app.controller('dashboardCtrl',
  function($scope, $rootScope, $location, UserService, $route) {
    $scope.$route = $route;
    var username = $rootScope.username;

    $scope.users = UserService.getUsers()
    for (x in $scope.users){
      if ($scope.users[x].username === $rootScope.username){
        $scope.loggedInUser = $scope.users[x];
      }
    }

    $scope.modules = $scope.loggedInUser.modules;

  })

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
    $scope.modules = $scope.loggedInUser.modules;
    $scope.newModule = function (){
      NewModuleService.newModule($scope.module);
      $scope.module = new Module({});
    }

    $scope.confirmDelete = function(index){
      debugger;
     $scope.modules.splice(index, 1);
     AssignmentService.getAssignments();
    }
  });

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

app.controller('moduleCtrl', 
  function ($scope, $rootScope, $routeParams, UserService, NewAssignmentService) {
   var users = UserService.getUsers();
   $scope.users = UserService.getUsers();
   for (x in $scope.users){
     if ($scope.users[x].username === $rootScope.username){
      $scope.modules = $scope.users[x].modules;
      for (y in $scope.modules){
        if ($scope.modules[y].id === $routeParams.moduleId){
          $scope.module = $scope.modules[y];
        }
      }
    }
  }
  $rootScope.module = $scope.module;
  $scope.assignments = $scope.module.assignments;
  $scope.newAssignment = function (){
    NewAssignmentService.newAssignment($scope.assignment);
    $scope.assignment = new Assignment({});
  }
  $scope.changeAssignment = function(index){
    
    if ($scope.assignments[index].complete === true){
        $scope.assignments[index].complete = false;
    }
    else{
        $scope.assignments[index].complete = true;
    }
  }
});

app.service('NewAssignmentService', function (AssignmentService, $rootScope, UserService, $routeParams){
  $rootScope.users = UserService.getUsers();
  $rootScope.modules = UserService.getModules();
  this.newAssignment = function(assignmentData) {
    var assignments = AssignmentService.getAssignments() || [];
    assignments.push(new Assignment(assignmentData, assignments.length, $routeParams.moduleId));
  }
});

app.service('NewModuleService', function (UserService){
  this.newModule = function(moduleData) {
    var modules = UserService.getModules() || [];
    modules.push(new Module(moduleData, modules.length));
  }
});

app.service('NewUserService', function (UserService){
  this.registerUser = function(userData) {
    var users = UserService.getUsers() || [];
    users.push(new User(userData));
  }
});

app.controller('NewUserController', function ($scope, NewUserService, $location, $rootScope, UserService){

  $scope.registerUser = function() {
    var users = UserService.getUsers();
    var signup = true;
    for (x in users){
      if (users[x].username === $scope.user.username){
        alert("Sorry, that username is already taken.")
        signup = false;
        break;
      }
      else if ($scope.user.password != $scope.user.password2){
        alert("Sorry, your passwords must match.")
        signup = false;
        break;
      }
      if (signup) {
        NewUserService.registerUser($scope.user);
        $rootScope.username = $scope.user.username;
        $scope.user = new User({});
        $rootScope.loggedIn = true;
        $location.path('/dashboard');
      }
    }

    
  }
});

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
});

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

app.factory('UserService', ['$http', '$rootScope', function ($http, $rootScope){
  $rootScope.users = [];
  $rootScope.modules = [];
  $http.get('users.json').success(function(userData){
    userData.forEach(function(data){
      $rootScope.users.push(new User(data));
    });
  })
  var api = {
    getUsers : function() {
     return $rootScope.users;
   },
   getModules : function() {
    for (x in $rootScope.users){
      if ($rootScope.users[x].username === $rootScope.username){
        var user = $rootScope.users[x];
      }
    }
    $rootScope.modules = user.modules;
    return $rootScope.modules
  }
}
return api
}]);

// user model
function User(data) {
  this.firstName = data.firstName || "",
  this.secondName = data.secondName || "",
  this.email = data.email || "",
  this.username = data.username || "",
  this.password = data.password || "",
  this.age = data.age || "",
  this.course = data.course || "",
  this.modules = data.modules || []
}

function Module(data, modulesLength) {
  this.id = (modulesLength+1).toString() || "",
  this.title = data.title || "",
  this.lecturer = data.lecturer || "",
  this.assignments = data.assignments || []
}

function Assignment(data, assignmentsLength, moduleId) {
  this.title = data.title || "",
  this.snippet = data.snippet || "",
  this.date = data.date || "",
  this.moduleId = moduleId || "",
  this.complete = false,
  this.id = (assignmentsLength+1).toString() || "",
  this.details = data.details || ""
}