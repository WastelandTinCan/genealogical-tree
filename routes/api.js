var neo = require('neo4j');
var parser = require('parse-gedcom');
var fs = require('fs');
var path = require('path');
var db = new neo.GraphDatabase('http://localhost:7474');

exports.allPersons = function(req, res) {
	db.query('MATCH (p:Person)\nRETURN p', function(err, data) {
		var results = [];
		forEach(data, function (item) {
			results.push({id: item.p._data.metadata.id, nodeData: item.p._data.data});
		})
    //console.log(results);
		res.json({data: results});
	})
  var file = fs.readFileSync("/Users/Lousan92/genealogical-tree/aleman.ged", "utf8");  
  //var file = fs.readFileSync("/Users/Lousan92/genealogical-tree/indi2.ged", "utf8");
  var fileSplit = file.split('\n');
  //console.log(fileSplit.length);
  var persons = [];
  var families = [];
  var isIndividual = false;
  var isFamily = false;
  var isName = false;
  var isBirth = false;
  var isDeath = false;
  var isMarriage = false;
  var data = {};
  for (var i = 0; i < fileSplit.length; ++i) {
    //console.log(fileSplit.length);
    //console.log("Línea "+i+" isBirth = "+isBirth);
    var line = fileSplit[i].split(' ');
    line = deleteEndlines(line);
    if (isIndividual) {
      if (isName) {
        if (line[1] == "GIVN") {
          data.name = line[2];
          //console.log("Nombre: "+line[2]);
        }
        if (line[1] == "SURN") {
          data.surnames = line[2];
          //console.log("Apellidos: "+line[2]);
        }
        isName = !(fileSplit[i+1].split(' ')[0] == "1");
      }
      if (isBirth) {
        //console.log("Hola");
        if (line[1] == "DATE") {
          var date = "";
          if (line.length == 5) date = parseDate(line[2], line[3], line[4]);
          else {
            for (var j = 2; j < line.length; ++j) date += line[j];
          }
          data.birthDate = date;
          //console.log("Fecha de nacimiento: "+date);
        }
        if (line[1] == "PLAC") {
          var birthCity = "";
          for (var j = 2; j < line.length; ++j) birthCity += line[j];
          data.birthCity = birthCity;
          //console.log("Lugar de nacimiento: "+birthCity);
        }
        isBirth = !(fileSplit[i+1].split(' ')[0] == "1");
      }
      if (isDeath) {
        if (line[1] == "DATE") {
          var date = "";
          if (line.length == 5) date = parseDate(line[2], line[3], line[4]);
          else {
            for (var j = 2; j < line.length; ++j) date += line[j];
          }
          data.deathDate = date;
          //console.log("Fecha de defunción: "+date);
        }
        if (line[1] == "PLAC") {
          var deathCity = "";
          for (var j = 2; j < line.length; ++j) birthCity += line[j];
          data.deathCity = deathCity;
          //console.log("Lugar de defunción: "+birthCity);
        }
        isDeath = !(fileSplit[i+1].split(' ')[0] == "1");
      }
      else {
        //console.log(line[1]);
        switch (line[1]) {
          case "NAME": 
            //console.log("NAME");
            isName = true;
            break;
          case "SEX": 
            //console.log("SEX");
            //console.log("Sexo: "+line[2]);
            data.sex = line[2];
            break;
          case "BIRT":
            //console.log("BIRT");
            isBirth = true;
            break;
          case "BIRTH":
            //console.log("BIRTH");
            isBirth = true;
            break;
          case "DEAT":
            //console.log("DEAT");
            isDeath = true;
            break;
          case "DEATH":
            //console.log("DEATH");
            isDeath = true;
            break;
        }
      }
    }
    if (isFamily) {
      if (isMarriage) {
        if (line[1] == "DATE") {
          var date = "";
          if (line.length == 5) date = parseDate(line[2], line[3], line[4]);
          else {
            for (var j = 2; j < line.length; ++j) date += line[j];
          }
          data.marriageDate = date;
        }
        if (line[1] == "PLAC") {
          var marriagePlace = "";
          for (var j = 2; j < line.length; ++j) marriagePlace += line[j];
          data.marriagePlace = marriagePlace;
        }
      }
      else {
        switch (line[1]) {
          case "HUSB":
            data.husband = line[2];
            break;
          case "WIFE":
            data.wife = line[2];
            break;
          case "CHIL":
            data.children.push(line[2]);
            break;
          case "MARR":
            isMarriage = true;
        }
      }
    }
    if (i+1 < fileSplit.length) {
      isIndividual = !(fileSplit[i+1].split(' ')[0] == "0");
      if (!isIndividual) {
        if (objectLength(individual) > 0) {
          if (persons.push(individual));
          individual = {};
        }
        //console.log("--------------------------");
      }
      //else if (line.length > 0) family.push(individual);
    else {
      if (line[0] == "0" && line[1][0] == "@" && line[1][1] == "I") {
        individual._id = line[1];
        isIndividual = true;
        //console.log(line[1]);
      }
      if (line[0] == "0" && line[1][0] == "@" && line[1][1] == "F") {
        relationships._id = line[1];
        isFamily = true;
        //console.log(line[1]);
      }
    }
  }
}
//var query = 'CREATE (p:Person {_id: ({_id}), name: ({name}), surnames: ({surnames}), sex: ({sex}), birthDate: ({birthDate}), deathDate: ({deathDate}), birthCity: ({birthCity}), deathCity: ({deathCity})})';
  for (var i = 0; i < persons.length; ++i) {
    var query = "CREATE (p:Person {";
    //console.log(family[i]);
    if (persons[i]._id) query += "_id: ({_id}), ";
    if (persons[i].name) query += "name: ({name}), ";
    if (persons[i].surnames) query += "surnames: ({surnames}), ";
    if (persons[i].sex) query += "sex: ({sex}), ";
    if (persons[i].birthDate) query += "birthDate: ({birthDate}), ";
    if (persons[i].deathDate) query += "deathDate: ({deathDate}), ";
    if (persons[i].birthCity) query += "birthCity: ({birthCity}), ";
    if (persons[i].deathCity) query += "deathCity: ({deathCity})";
    if (query[query.length-2] == ",") query = query.substring(0, query.length-2);
    query += " })";
    console.log(query);
    /*db.query(query, family[i], function (err) {
      if (err) console.log(err);
      else ("¡Bien!");
    });*/
  }
}

exports.newPerson = function(req, res) {
	var params = {name: req.body.name, 
                surnames: req.body.surnames,
                sex: req.body.sex,
                birthDate: req.body.birthDate,
                deathDate: req.body.deathDate,
                birthCity: req.body.birthCity,
                residCity: req.body.residCity,
                deathCity: req.body.deathCity}
  console.log(params);
  var query = 'CREATE (p:Person {name: ({name}), surnames: ({surnames}), sex: ({sex}), birthDate: ({birthDate}),';
  if (params.deathDate) query += 'deathDate: ({deathDate}),';
  query += ' birthCity: ({birthCity}), residCity: ({residCity})'; 
  if (params.deathCity) query += ', deathCity: ({deathCity}) })';
  else query += ' })';
	db.query(query, params, function (err) {
		if (err) {
      res.json(false); 
    }
    else {
			res.json(true);
		}
	})
}

exports.editNode = function(req, res) {
  var intId = parseInt(""+req.params.id);
  var params = {_id: intId,
                name: req.body.name, 
                surnames: req.body.surnames,
                sex: req.body.sex,
                birthDate: req.body.birthDate,
                deathDate: req.body.deathDate,
                birthCity: req.body.birthCity,
                residCity: req.body.residCity,
                deathCity: req.body.deathCity}
  console.log(params);
  var query = 'MATCH (p: Person) WHERE id(p) = ({_id}) SET p.name = ({name}), p.surnames = ({surnames}), p.sex = ({sex}), p.birthDate = ({birthDate}), p.deathDate = ({deathDate}), p.birthCity = ({birthCity}), p.residCity = ({residCity}), p.deathCity = ({deathCity})';
  db.query(query, params, function (err, data) {
    if (err) {
      console.log(err);
      res.json(false);
    }
    else { 
      console.log(data);
      res.json(data);
    }
  });
}

exports.nodeData = function(req, res) {
  var results = [];
  db.getNodeById(req.params.id, function (err, data) {
      console.log(data._data.data.name);
      results.push({name: data._data.data.name, surnames: data._data.data.surnames, sex: data._data.data.sex, birthDate: data._data.data.birthDate, deathDate: data._data.data.deathDate, birthCity: data._data.data.birthCity, residCity: data._data.data.residCity, deathCity: data._data.data.deathCity});
      res.json({data: results});
    });
}

exports.newChild = function(req, res) {
  console.log(req.body);
  var params = {name: req.params.id},
      last = {},
      Query,
      firstChild = 'MATCH (p:Master)\nWHERE n.name = ({name})\nCREATE (n)<-[:CHILD_OF]-(l:Child {name: ({child})})\nRETURN l',
      endChild = 'MATCH (n:Child)\nWHERE n.name = ({name})\nCREATE (n)<-[:CHILD_OF]-(l:Child {name: ({child})})\nRETURN l';

  db.query('MATCH (n:Master)-[a:CHILD_OF*1..]-(l:Child)\nWHERE n.name = ({name}) AND NOT (l)<-[:CHILD_OF]-()\nRETURN l', params,
    function (err, data) {
      if(err) { console.log(err); } else {
        console.log(data);
        if(data.length < 1) {
          Query = firstChild;
          params.child = req.body.name;
        } else {
        last.name = data[0].l._data.data.name; //name of terminal child
        last.child = req.body.name; //name of new child
        params = last;
        Query = endChild;
        }
        db.query(Query,params, function (err, data) {
            if(err) {console.log('second query: ' + err);} else {
              res.json(true);
            }
          })
      }
    })
}

/*exports.upload = function(req, res) {
  var fileData = req.files.gedcom_file;
  var file = fs.readFileSync(fileData.path, "utf8");
  var fileSplit = file.split('\n');
  var family = {};
  var isIndividual = false;
  var isName = false;
  var isBirth = false;
  var individual = {};
  for (var i = 0; i < fileSplit.length; ++i) {
    var line = fileSplit[i].split(' ');
    if (line.length == 1 && line[0] == "") {
      isIndividual = false;
      family.push(individual);
      individual = {};
    }
    if (isName) {

    }
    else if (isBirth) {
      if (line[1] == "DATE") {

        
      individual.birthDate = parseDate(line[2], line[3], line[4]);
    }
    if (isIndividual) {
      if (line[1] == "NAME") isName = true;
      if (line[1] == "SEX") individual.sex = line[2];
      if (line[1] == "BIRTH") isBirth = true;
    }
    if (line[0] == "0" && line[1][0] == "@" && line[1][1] == "I") {
      isIndividual = true;
    } 
    /*if (fileSplit[i][0] == "0" && fileSplit[i][2] == "@" && fileSplit[i][3] == "I") {
      console.log("¡Un individuo salvaje!");
      individualFound = true;
    }
    if (individualfileSplit[i])
  }
}*/

exports.deleteNode = function(req, res) {
  var intId = parseInt(""+req.params.id);
  var params = {_id: intId};
  console.log(params);
  var deletePerson = 'MATCH (p:Person) WHERE id(p) = ({_id}) DELETE p';
      deletePersonAndRels = 'MATCH (p:Person)-[r]-() WHERE id(p) = ({_id}) DELETE p, r';
  var query_func = function (err) {
      if (err) {
        console.log(err);
        res.json(false);
      }
      else res.json(true);
  };
  db.query('MATCH (p:Person)-[r]-()\nWHERE id(p) = ({_id})\nRETURN r', params,
    function (err, data) {
      console.log(err || data);
      if (!err) {
        if (data.length > 0) {
          db.query(deletePersonAndRels, params, query_func);
        }
        else db.query(deletePerson, params, query_func);
      }
    });
}

function parseDate(day, month, year) {
  var strDate = "";
  strDate += year;
  strDate += "-";
  if (month.length == 3) strDate += monthParsing3(month);
  else strDate += monthParsingFuck(month);
  strDate += "-";
  if (day.length == 1) {
    var dayInt = parseInt(day);
    if (dayInt < 10) strDate += "0";
  }
  strDate += day;
  return strDate;
}

function monthParsing3(month) {
  switch (month) {
    case "JAN": return "01";
    case "Jan": return "01";
    case "FEB": return "02";
    case "Feb": return "02";
    case "MAR": return "03";
    case "Mar": return "03";
    case "APR": return "04";
    case "Apr": return "04";
    case "MAY": return "05";
    case "May": return "05";
    case "JUN": return "06";
    case "Jun": return "06";
    case "JUL": return "07";
    case "Jul": return "07";
    case "AUG": return "08";
    case "Aug": return "08";
    case "SEP": return "09";
    case "Sep": return "09";
    case "OCT": return "10";
    case "Oct": return "10";
    case "NOV": return "11";
    case "Nov": return "11";
    case "DEC": return "12";
    case "Dec": return "12";
  }
}

function monthParsingFuck(month) {
  switch (month) {
    case "January": return "01";
    case "February": return "02";
    case "March": return "03";
    case "April": return "04";
    case "May": return "05";
    case "June": return "06";
    case "July": return "07";
    case "August": return "08";
    case "September": return "09";
    case "October": return "10";
    case "November": return "11";
    case "December": return "12";
  }
}

function objectLength(object) {
  var size = 0;
  var key;
  for (key in object) {
    if (object.hasOwnProperty(key)) ++size;
  }
  return size;
}

function deleteEndlines(array) {
  for (var i = 0; i < array.length; ++i) {
    array[i] = array[i].replace('\r', '');
  }
  return array;
}

function forEach(array, fn) {
  for (var i = 0; i < array.length; ++i) {
    fn(array[i], i);
  }
}