var myApp = angular.module("myApp", []);
myApp.config(["$routeProvider","$locationProvider", function ($routeProvider, $locationProvider) {
  $routeProvider.
    when("/", {
      templateUrl: "/partials/test",
      controller: GraphCtrl
    }).
    when("/add", {
      templateUrl: "/partials/newPerson",
    }).
    when("/upload", {
      templateUrl: "partials/upload"
    }).
    otherwise({
      redirectTo: "/"
    });
    $locationProvider.html5Mode(true);
}]);