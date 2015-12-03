/* this is an app to provide the functionality for a college assistant
 it is built using angular.js

 it is an assignment for Component Development in Applied Computing
 By Stpehen Coady
 */


 var app = angular.module('collegeApp', ['ngRoute'])



 app.config(['$routeProvider',
  function ($routeProvider, $rootScope) {
    $routeProvider
    .when('/', {
      resolve: {
        "check": function($location, $rootScope) {
          if($rootScope.loggedIn){
            $location.path('/dashboard');
          }
        }
      },
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
    .when('/timetable', {
      resolve: {
        "check": function($location, $rootScope) {
          if(!$rootScope.loggedIn){
            $location.path('/');
          }
        }
      },
      templateUrl: './partials/timetable.html',
      controller: "timetableCtrl",
      activetab: 'timetable'
    })
    .otherwise({
      redirectTo: '/'
    });
  }]);


//this is the controller for the landing page, 
//which controls what the user sees when they first visit the app

app.controller('myCtrl', function($scope, $rootScope) {
  $rootScope.loggedIn = false;
  
  $scope.user = {
    role: 'public'
  };

  $scope.logout = function(){
    $scope.user = {
      role: 'public'
    };
    $rootScope.loggedIn = false;
    $rootScope.username = null;
    alertify.success("See you soon!");
  };
});


//the controller for the user's profile page
app.controller('profileCtrl', function ($scope, $rootScope, $route, UserService) {
  $scope.$route = $route;

  var users = UserService.getUsers()
  for (x in users){
    if (users[x].username === $rootScope.username){
      $scope.user = users[x];
    }
  }

  $scope.editUser = function (user){
    $scope.user = user;
    alertify.success("Information Updated!")
  }
});

//the controller for the timetable view. Not really used as functionality is not complete
app.controller('timetableCtrl', function ($scope, $rootScope, $route, TimetableService, UserService) {
  $scope.$route = $route;
  $rootScope.users = UserService.getUsers();
  $scope.modules = UserService.getModules();
  $scope.timetable = TimetableService.getTimetable();
});

//the controller to allow logging in fucntionality
app.controller('loginCtrl', function ($scope, $location, $rootScope, UserService) {
  

  $scope.username = "user"; // set so that it is easy to log in for testing
  $scope.password = "pass";
  
  $scope.submit = function(){
    var usrname = $scope.username;
    var pass = $scope.password;
    var users = UserService.getUsers();
    // UserService.addUsers(users);
    for (x in users) {
      if (users[x].username === $scope.username){
        if(users[x].password === $scope.password){
          var realUser = true;
        }
      }
    };
    
    if(realUser) {
      alertify.success("Successfully logged in!");
      $rootScope.username = $scope.username
      $rootScope.loggedIn = true;
      $location.path('/dashboard');
      if($rootScope.username === 'admin'){

        $scope.user.role = 'admin';
      }


    } else {
      alertify.error("Incorrect username or password.");
    }

  };

});


//controls the dashboard. most of this controller is utilised by the admin account.
app.controller('dashboardCtrl', function ($scope, $rootScope, $location, UserService, $route) {
  $scope.$route = $route;
  var username = $rootScope.username;
  $scope.modules = UserService.getModules();
  debugger;
  $scope.users = UserService.getUsers()
  for (x in $scope.users){
    if ($scope.users[x].username === $rootScope.username){
      $scope.loggedInUser = $scope.users[x];
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
  user.state = "normal";
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

// a service to create the new assignment. called from the moduleCtrl controller
app.service('NewAssignmentService', function (AssignmentService, $rootScope, UserService, $routeParams){
  $rootScope.users = UserService.getUsers();
  $rootScope.modules = UserService.getModules();
  this.newAssignment = function(assignmentData) {
    var assignments = AssignmentService.getAssignments() || [];
    assignments.push(new Assignment(assignmentData, assignments.length, $routeParams.moduleId));
  }
});

//a service to create a new module and push it to a user's arrray of modules
app.service('NewModuleService', function (UserService){
  this.newModule = function(moduleData) {
    var modules = UserService.getModules() || [];
    modules.push(new Module(moduleData, modules.length));
  }
});

// a service to create a user
app.service('NewUserService', function (UserService, $http){
  this.registerUser = function(userData) {
    UserService.addUser(userData)
    .success(function(userData) {
      var users = UserService.getUsers() || [];
      //var user = new User(userData)
      users.push(userData);
    });
  }
});

// a contoller which handles the signing up of new users.
app.controller('NewUserController', function ($scope, NewUserService, $location, $rootScope, UserService){

  $scope.registerUser = function() {
    var users = UserService.getUsers();
    var signup = true; // if this variable is still true by the end of this function, then the user may sign up

    if($scope.user.firstName === undefined || 
      $scope.user.secondName === undefined ||
      $scope.user.age === undefined ||
      $scope.user.email === undefined ||
      $scope.user.username === undefined ||
      $scope.user.password === undefined ||
      $scope.user.password2 === undefined
      )
    {
      alertify.error("Sorry, all fields must be filled in.")
      signup = false;
    }

    for (x in users){
      if (users[x].username === $scope.user.username){
        alertify.error("Sorry, that username is already taken.")
        signup = false;
        break;
      }
      if ($scope.user.password !== $scope.user.password2){
        alertify.error("Sorry, your passwords must match.")
        signup = false;
        break;
      }
      if (users[x].email === $scope.user.email){
        alertify.error("Sorry, that email is already in use.")
        signup = false;
        break;
      }
    }
    if (signup) {
      NewUserService.registerUser($scope.user);
      alertify.success("Welcome, " + $scope.user.firstName + "!");
      $rootScope.username = $scope.user.username;
      $scope.user = new User({});
      $rootScope.loggedIn = true;
      $location.path('/dashboard');
    }

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

// a factory service to get a user's timetable.
app.factory('TimetableService', ['$http', '$rootScope', '$routeParams', function ($http, $rootScope, $routeParams){
  $rootScope.timetable = [];
  var api = {
   getTimetable : function() {
    for (x in $rootScope.users){
      if ($rootScope.users[x].username === $rootScope.username){
        var user = $rootScope.users[x];
      }
    }
    $rootScope.timetable = user.timetable;
    return $rootScope.timetable;
  }
}
return api
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

// a model of the module object
function Module(data, modulesLength) {
  this.id = (modulesLength+1).toString() || "",
  this.title = data.title || "",
  this.lecturer = data.lecturer || "",
  this.assignments = data.assignments || []
}

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

// a simple model of the timetable object. by default it is empty on signup
function Timetable() {
  return [{ "day":"Monday", "9am":"", "10am":"", "11am":"", "12pm":"", "1pm":"", "2pm":"", "3pm":"", "4pm":"" }, { "day":"Tuesday", "9am":"", "10am":"", "11am":"", "12pm":"", "1pm":"", "2pm":"", "3pm":"", "4pm":"" }, { "day":"Wednesday", "9am":"", "10am":"", "11am":"", "12pm":"", "1pm":"", "2pm":"", "3pm":"", "4pm":"" }, { "day":"Thursday", "9am":"", "10am":"", "11am":"", "12pm":"", "1pm":"", "2pm":"", "3pm":"", "4pm":"" }, { "day":"Friday", "9am":"", "10am":"", "11am":"", "12pm":"", "1pm":"", "2pm":"", "3pm":"", "4pm":"" }];
}