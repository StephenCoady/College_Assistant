var app = angular.module('collegeApp')

//the controller for the timetable view. Not really used as functionality is not complete
app.controller('timetableCtrl', function ($scope, $rootScope, $route, TimetableService, UserService) {
  $scope.$route = $route;
  $rootScope.users = UserService.getUsers();
  $scope.modules = UserService.getModules($rootScope.user);
  $scope.timetable = TimetableService.getTimetable();
});

// a simple model of the timetable object. by default it is empty on signup
function Timetable() {
  return [{ "day":"Monday", "9am":"", "10am":"", "11am":"", "12pm":"", "1pm":"", "2pm":"", "3pm":"", "4pm":"" }, { "day":"Tuesday", "9am":"", "10am":"", "11am":"", "12pm":"", "1pm":"", "2pm":"", "3pm":"", "4pm":"" }, { "day":"Wednesday", "9am":"", "10am":"", "11am":"", "12pm":"", "1pm":"", "2pm":"", "3pm":"", "4pm":"" }, { "day":"Thursday", "9am":"", "10am":"", "11am":"", "12pm":"", "1pm":"", "2pm":"", "3pm":"", "4pm":"" }, { "day":"Friday", "9am":"", "10am":"", "11am":"", "12pm":"", "1pm":"", "2pm":"", "3pm":"", "4pm":"" }];
}