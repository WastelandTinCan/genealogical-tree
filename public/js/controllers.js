
/* Controllers */

function IndexCtrl ($scope, $http) {
	$http.get('/api/allPersons').success(function (data) {
    $scope.data = [];
    for (var i = 0; i < data.data.length; ++i) { 
      $scope.data.push({id: data.data[i].id, nodeData: data.data[i].nodeData}); 
    }
    console.log($scope.data);
	});
}

function NewPersonCtrl ($scope, $http, $location) {
	$scope.form = {};
  hideAll = function() {
    messBlock.style.display = "none";
    for (var i = 0; i < messages.length; ++i) {
      messages[i].style.display = "none";
    }
  }
  var messBlock = document.getElementById("alerts");
  var messages = [];
  var validForm = true;
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
    validForm = true;
    form = $scope.form;
    if (!form.name) {
      messBlock.style.display = "";
      messages[0].style.display = "";
      validForm = false;
    }
    if (!form.surnames) {
      messBlock.style.display = "";
      messages[1].style.display = "";
      validForm = false;
    }
    if (!form.sex) {
      messBlock.style.display = "";
      messages[2].style.display = "";
      validForm = false;
    }
    if (!form.birthDate) {
      messBlock.style.display = "";
      messages[3].style.display = "";
      validForm = false;
    }
    if (form.deathDate && (form.birthDate > form.deathDate)) {
      messBlock.style.display = "";
      messages[4].style.display = "";
      validForm = false;
    }
    if (!form.birthCity) {
      messBlock.style.display = "";
      messages[5].style.display = "";
      validForm = false;
    }
    if (!form.residCity) {
      messBlock.style.display = "";
      messages[6].style.display = "";
      validForm = false;
    }
    if (validForm) {
      console.log("¡He llegado!");
      $http.post('/api/newPerson', $scope.form).success(function (data) {
        console.log(data);
        $location.url('/');
      })
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
  console.log(id);
  $http.get('/api/nodeData/'+id).success(function (data) {
    console.log(data.data[0].name);
    var sex_data, deathDate_data, deathCity_data;
    if (data.data[0].sex == "M") { sex_data = "Hombre"; }
    else { sex_data = "Mujer"; }
    if (!data.data[0].deathDate) { deathDate_data = "Aún vivo"; }
    else { deathDate_data = data.data[0].deathDate; }
    if (!data.data[0].deathCity) { deathCity_data = "Aún vivo"; }
    else { deathCity_data = data.data[0].deathCity; }
    $scope.data = {name: data.data[0].name, 
                   surnames: data.data[0].surnames, 
                   sex: sex_data, 
                   birthDate: data.data[0].birthDate, 
                   deathDate: deathDate_data,
                   birthCity: data.data[0].birthCity,
                   residCity: data.data[0].residCity,
                   deathCity: deathCity_data };
  });
  $scope.addChild = function() {
    $http.post('/api/newChild/'+id, $scope.form).success(function (data) {
      $route.reload();
    })
  }
}