var myApp = angular.module("myApp", []);
myApp.config(["$routeProvider","$locationProvider", function ($routeProvider, $locationProvider) {
  $routeProvider.
    when("/", {
      templateUrl: "/partials/index",
      controller: IndexCtrl
    }).
    when("/add", {
      templateUrl: "/partials/newPerson",
      controller: NewPersonCtrl
    }).
    when("/viewNode/:id", {
      templateUrl: "/partials/viewNode",
      controller: DisplayNodeCtrl
    }).
    when("/upload", {
      templateUrl: "partials/upload"
    }).
    /*when("/deleteAll", {
      controller: DeleteAllCtrl
    }).*/
    otherwise({
      redirectTo: "/"
    });
    $locationProvider.html5Mode(true);
}]);