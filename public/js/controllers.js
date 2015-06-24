
/* Controllers */

function IndexCtrl ($scope, $http) {
	$http.get('/api/master').success(function (data) {
		$scope.data = data.data;
	});
}

function NewPersonCtrl ($scope, $http, $location) {
	$scope.form = {};
  hideAll = function() {
    messBlock.style.display = "none";
    for (var x = 0; x < messages.length; ++x) {
      messages[x].style.display = "none";
    }
  }
  var messBlock = document.getElementById("alerts");
  var messages = [];
  messages[0] = document.getElementById("name");
  messages[1] = document.getElementById("surnames");
  messages[2] = document.getElementById("sex");
  messages[3] = document.getElementById("birthDate");
  messages[4] = document.getElementById("dates");
  messages[5] = document.getElementById("birthCity");
  messages[6] = document.getElementById("residCity");
  hideAll();
	$scope.createPerson = function() {
    hideAll();
    form = $scope.form;
    if (!form.name) {
      messBlock.style.display = "";
      messages[0].style.display = "";
    }
    if (!form.surnames) {
      messBlock.style.display = "";
      messages[1].style.display = "";
    }
    if (!form.sex) {
      messBlock.style.display = "";
      messages[2].style.display = "";
    }
    if (!form.birthDate) {
      messBlock.style.display = "";
      messages[3].style.display = "";
    }
    if (form.birthDate > form.deathDate) {
      messBlock.style.display = "";
      messages[4].style.display = "";
    }
    if (!form.birthCity) {
      messBlock.style.display = "";
      messages[5].style.display = "";
    }
    if (!form.residCity) {
      messBlock.style.display = "";
      messages[6].style.display = "";
    }
    console.log("Fechas ="+form.birthDate > form.deathDate);
    if (form.birthDate > form.deathDate) {
      console.log("Entro en el IF");
      //document.getElementById("p1").innerHTML = "Fechas incorrectas";
    }
		else if (form.birthDate < form.deathDate) {
      console.log("?");
	 }
  }
}

function DeleteNodeCtrl ($scope, $http, $location, $routeParams, $route) {
  	$scope.form = {};
    var id = $routeParams.id;
  	$scope.deleteNode = function() {
    	$http.post('/api/deleteNode/'+id, $scope.form).success(
        function (data) {
      		$location.url('/');
    	})
    }
}

function ViewNode ($scope, $http, $location, $routeParams, $route) {
  $scope.form = {};
  var id = $routeParams.id;
  $http.get('/api/chain/' + id).success(function (data) {
  	console.log(data);
    $scope.data = {master: id, children: data.data};
  });
  $scope.addChild = function() {
    $http.post('/api/newChild/'+id, $scope.form).success(function (data) {
      $route.reload();
    })
  }
}