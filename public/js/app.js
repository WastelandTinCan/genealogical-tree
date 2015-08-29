var myApp = angular.module("myApp", []);
myApp.config(["$routeProvider","$locationProvider", function ($routeProvider, $locationProvider) {
  $routeProvider.
    /*when("/", {
      templateUrl: "/partials/index",
      controller: IndexCtrl
    })*/
    when("/", {
      templateUrl: "/partials/test",
      controller: D3Ctrl
    }).
    when("/add", {
      templateUrl: "/partials/newPerson",
      controller: NewPersonCtrl
    }).
<<<<<<< HEAD
    when("/viewNode/:id", {
      templateUrl: "/partials/viewNode",
      controller: DisplayNodeCtrl
=======
    when('/viewNode/:id', {
      templateUrl: '/partials/viewNode',
      controller: ViewNode
    }).
    when('/delete/:id', {
      templateUrl: '/partials/deletion',
      controller: DeleteNodeCtrl
>>>>>>> parent of c37cb41... Added support to edit nodes on-time
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