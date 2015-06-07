
/* Controllers */

function IndexCtrl ($scope, $http) {
	$http.get('/api/master').success(function (data) {
		$scope.data = data.data;
	});
}

function NewPersonCtrl ($scope, $http, $location) {
	$scope.form = {};
	$scope.createPerson = function() {
		$http.post('/api/newPerson', $scope.form).
		success(function (data) {
			$location.url('/');
		})
	}
}

function ViewNode ($scope, $http, $location, $routeParams, $route) {
  $scope.form = {};
  var id = $routeParams.id;
  $http.get('/api/chain/' + id).success(function (data) {
    $scope.data = {master: id, children: data.data};
  });
  $scope.addChild = function() {
    $http.post('/api/newChild/'+id, $scope.form).success(function (data) {
      $route.reload();
    })
  }
}