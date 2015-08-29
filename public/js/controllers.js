
/* Controllers */

function IndexCtrl($scope, $http, $location) {
	$http.get("/api/allPersons").success(function (data) {
    $scope.data = [];
    for (var i = 0; i < data.data.length; ++i) { 
      $scope.data.push({id: data.data[i].id, nodeData: data.data[i].nodeData}); 
    }
	});
  $scope.deleteNode = function(id) {
    $http.post("/api/deleteNode/"+id).success(function (data) {
      $http.get("/api/allPersons").success(function (data) {
        $scope.data = [];
        for (var i = 0; i < data.data.length; ++i) { 
          $scope.data.push({id: data.data[i].id, nodeData: data.data[i].nodeData}); 
        }
      });
      $location.url("/");
    });
  };
}

function D3Ctrl($scope, $http, $location) {  
    function idIndex(a, id) {
      for (var i = 0; i < a.length; i++) {
        if (a[i].id == id) return i;
      }
      return null;
    }
    function drawGraph(data) {
      // Creating graph object
      var nodes = [];
      var links = [];
      data.results[0].data.forEach(function (row) {
        row.graph.nodes.forEach(function (n) {
          var node = {id: n.id,
                      label: n.labels[0],
                      title: n.properties.name};
          if (idIndex(nodes,n.id) == null) nodes.push(node);
        });
        links = links.concat(row.graph.relationships.map(function (r) {
          return {source: idIndex(nodes, r.startNode),
                  target: idIndex(nodes, r.endNode),
                  type: r.type, 
                  value: 1};
        }));
      });
    graph = {nodes: nodes, links: links};
    console.log(graph);

    // force layout setup
    var width = 960;
    var height = 500;
    var force = d3.layout.force(-120)
                  .charge(10).linkDistance(10).size([width, height]);

    // setup svg div
    var svg = d3.select("#graph").append("svg")
                .attr("width", "100%").attr("height", "100%")
                .attr("pointer-events", "all");

    // load graph (nodes,links) json from /graph endpoint
    force.nodes(graph.nodes).links(graph.links).start();

    // render relationships as lines
    var link = svg.selectAll(".link")
              .data(graph.links).enter()
              .append("line").attr("class", "link");

    //color assignment
    var getColor = {"Person": "#80E810", 
                    "Place": "#10DDE8"};

    // render nodes as circles, css-class from label
    var node = svg.selectAll(".node")
                  .data(graph.nodes).enter()
                  .append("circle")
                  .attr("class", function (d) { 
                    return "node "+d.label;
                  })
                  .attr("r", 50)
                  .attr("fill", function (d) {
                    return getColor[d.label];
                  })
                  .call(force.drag);

    // html title attribute for title node-attribute
    node.append("title")
        .text(function (d) {
          return d.title; 
        });

    // force feed algo ticks for coordinate computation
    force.on("tick", function() {
      link.attr("x1", function (d) { 
        return d.source.x; 
      })
          .attr("stroke", "#999")
          .attr("y1", function (d) { 
            return d.source.y; 
          })
          .attr("x2", function (d) { 
            return d.target.x; 
          })
          .attr("y2", function (d) { 
            return d.target.y; 
          });

      node.attr("cx", function (d) { 
            return d.x; 
           })
          .attr("cy", function (d) { 
            return d.y; 
          });
    });
  };
  var postData = {"statements": [{"statement": "MATCH path = (n:Person)-[r:ParentOf]->(p:Person) RETURN path",
                                  "resultDataContents": ["graph"]}]};
  $.ajax({
       type: "POST",
       accept: "application/json",
       contentType:"application/json; charset=utf-8",
       url: "http://localhost:7474/db/data/transaction/commit",
       data: JSON.stringify(postData),
       success: function(data, textStatus, jqXHR) {
          drawGraph(data);
       },
       failure: function(msg) {
          console.log("failed");
       }
  });
}

function NewPersonCtrl($scope, $http, $location) {
	$scope.form = {};
  function hideAll() {
    for (var i = 0; i < messages.length; ++i) {
      messages[i].style.display = "none";
    }
  }
  var messages = [];
  messages[0] = document.getElementById("name");
  messages[1] = document.getElementById("surnames");
  messages[2] = document.getElementById("sex");
  messages[3] = document.getElementById("birthDate");
  messages[4] = document.getElementById("dates");
  messages[5] = document.getElementById("birthPlace");
  messages[6] = document.getElementById("residPlace");
  messages[7] = document.getElementById("alerts");
  hideAll();
	$scope.createPerson = function() {
    hideAll();
    var validForm = true;
    if (!$scope.form.name) {
      messages[7].style.display = "";
      messages[0].style.display = "";
      validForm = false;
    }
    if (!$scope.form.surnames) {
      messages[7].style.display = "";
      messages[1].style.display = "";
      validForm = false;
    }
    if (!$scope.form.sex) {
      messages[7].style.display = "";
      messages[2].style.display = "";
      validForm = false;
    }
    if (!$scope.form.birthDate) {
      messages[7].style.display = "";
      messages[3].style.display = "";
      validForm = false;
    }
    if ($scope.form.deathDate && ($scope.form.birthDate > $scope.form.deathDate)) {
      messages[7].style.display = "";
      messages[4].style.display = "";
      validForm = false;
    }
    if (!$scope.form.birthPlace) {
      messages[7].style.display = "";
      messages[5].style.display = "";
      validForm = false;
    }
    if (!$scope.form.residPlace) {
      messages[7].style.display = "";
      messages[6].style.display = "";
      validForm = false;
    }
    if (validForm) {
      $http.post("/api/newPerson", $scope.form).success(function (data) {
        $location.url("/");
      })
    }
  }
}

/*function DeleteAllCtrl($scope, $http) {
  $http.post("/api/deleteAll").success(function() {
    console.log("Todo borrado");
  });
}*/

function DisplayNodeCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
<<<<<<< HEAD
  //Hola
=======
  var id = $routeParams.id;
>>>>>>> parent of e607f93... Visualization almost finished
  var temp_data = {name: "name",
                   surnames: "surnames",
                   sex: "sex",
                   birthDate: "birthDate",
                   deathDate: "deathDate",
                   birthPlace: "birthPlace",
                   residPlace: "residPlace",
                   deathPlace: "deathPlace"};
  var isEditable = false;
  function displayElements(elem, action) {
    var display;
    if (action == "hide") display = "none";
    else if (action == "show") display = "";
    for (var i = 0; i < elem.length; ++i) elem[i].style.display = display;
  }
  function getNodeData(id) {
    $http.get("/api/nodeData/"+id).success(function (data) {
    $scope.data = {name: data.data[0].name, 
                   surnames: data.data[0].surnames, 
                   sex: data.data[0].sex, 
                   birthDate: data.data[0].birthDate, 
                   deathDate: data.data[0].deathDate,
                   birthPlace: data.data[0].birthPlace,
                   residPlace: data.data[0].residPlace,
                   deathPlace: data.data[0].deathPlace};
    console.log($scope.data);
    temp_data.name = $scope.data.name; 
    temp_data.surnames = $scope.data.surnames; 
    temp_data.sex = $scope.data.sex;
    temp_data.birthDate = $scope.data.birthDate;
    temp_data.deathDate = $scope.data.deathDate;
    temp_data.birthPlace = $scope.data.birthPlace;
    temp_data.residPlace = $scope.data.residPlace;
    temp_data.deathPlace = $scope.data.deathPlace;
    });
  }
  var fields = [];
  var data = [];
  var messages = [];
  messages[0] = document.getElementById("name");
  messages[1] = document.getElementById("surnames");
  messages[2] = document.getElementById("sex");
  messages[3] = document.getElementById("birthDate");
  messages[4] = document.getElementById("dates");
  messages[5] = document.getElementById("birthPlace");
  messages[6] = document.getElementById("residPlace");
  messages[7] = document.getElementById("alerts");
  fields[0] = document.getElementById("field_name");
  fields[1] = document.getElementById("field_surnames");
  fields[2] = document.getElementById("field_sex");
  fields[3] = document.getElementById("field_birthDate");
  fields[4] = document.getElementById("field_deathDate");
  fields[5] = document.getElementById("field_birthPlace");
  fields[6] = document.getElementById("field_residPlace");
  fields[7] = document.getElementById("field_deathPlace");
  data[0] = document.getElementById("name_data");
  data[1] = document.getElementById("surnames_data");
  data[2] = document.getElementById("sex_data");
  data[3] = document.getElementById("birthDate_data");
  data[4] = document.getElementById("deathDate_data");
  data[5] = document.getElementById("birthPlace_data");
  data[6] = document.getElementById("residPlace_data");
  data[7] = document.getElementById("deathPlace_data");
  var validForm = true;
  displayElements(messages, "hide");
  displayElements(fields, "hide");
  console.log(id);
  getNodeData(id);
  $scope.isNull = function(data) {
    if (!data) return true;
    else return false;
  }
  $scope.enableEditForm = function() {
    displayElements(fields, "show");
    displayElements(data, "hide");
    displayElements(messages, "hide");
    isEditable = true;
    $scope.data.name = temp_data.name;
    $scope.data.surnames = temp_data.surnames;
    $scope.data.sex = temp_data.sex;
    $scope.data.birthDate = temp_data.birthDate;
    $scope.data.deathDate = temp_data.deathDate;
    $scope.data.birthPlace = temp_data.birthPlace;
    $scope.data.residPlace = temp_data.residPlace;
    $scope.data.deathPlace = temp_data.deathPlace;
  }

  $scope.disableEditForm = function() {
    displayElements(fields, "hide");
    displayElements(data, "show");
    displayElements(messages, "hide");
    isEditable = false;
    $scope.data.name = temp_data.name;
    $scope.data.surnames = temp_data.surnames;
    $scope.data.sex = temp_data.sex;
    $scope.data.birthDate = temp_data.birthDate;
    $scope.data.deathDate = temp_data.deathDate;
    $scope.data.birthPlace = temp_data.birthPlace;
    $scope.data.residPlace = temp_data.residPlace;
    $scope.data.deathPlace = temp_data.deathPlace;
  }

  $scope.editData = function() {
    displayElements(messages, "hide");
    var validForm = true;
    var params = {name: $scope.data.name,
                    surnames: $scope.data.surnames,
                    sex: $scope.data.sex,
                    birthDate: $scope.data.birthDate,
                    deathDate: $scope.data.deathDate,
                    birthPlace: $scope.data.birthPlace,
                    residPlace: $scope.data.residPlace,
                    deathPlace: $scope.data.deathPlace};
    if (!params.name) {
      messages[7].style.display = "";
      messages[0].style.display = "";
      validForm = false;
    }
    if (!params.surnames) {
      messages[7].style.display = "";
      messages[1].style.display = "";
      validForm = false;
    }
    if (!params.sex) {
      messages[7].style.display = "";
      messages[2].style.display = "";
      validForm = false;
    }
    if (!params.birthDate) {
      messages[7].style.display = "";
      messages[3].style.display = "";
      validForm = false;
    }
    if (params.deathDate && (params.birthDate > params.deathDate)) {
      messages[7].style.display = "";
      messages[4].style.display = "";
      validForm = false;
    }
    if (!params.birthPlace) {
      messages[7].style.display = "";
      messages[5].style.display = "";
      validForm = false;
    }
    if (!params.residPlace) {
      messages[7].style.display = "";
      messages[6].style.display = "";
      validForm = false;
    }
    console.log(validForm);
    if (validForm) {
      $http.post("/api/editNode/"+id, params).success(function (data) {
        console.log(data);
        getNodeData(id);
        $scope.disableEditForm();
        console.log("¿Sí?");
      })
    }
  }
  $scope.isEditable = function() {
    return isEditable;
  }
}