var neo = require('neo4j');
var db = new neo.GraphDatabase('http://localhost:7474');

exports.allPersons = function(req, res) {
	db.query('MATCH (p:Person)\nRETURN p', function(err, data) {
		var results = [];
		forEach(data, function (item) {
			results.push({id: item.p._data.metadata.id, nodeData: item.p._data.data});
		})
    console.log(results);
		res.json({data: results});
	})
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
      console.log("Ha salido mal");
      res.json(false); 
    }
    else {
      console.log("Ha salido bien");
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
  console.log("finish");
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
          console.log("¿Entras?");
          db.query(deletePersonAndRels, params, query_func);
        }
        else db.query(deletePerson, params, query_func);
      }
    });
}

function forEach(array, fn) {
  for(var i = 0; i < array.length; i++) {
    fn(array[i], i);
  }
}