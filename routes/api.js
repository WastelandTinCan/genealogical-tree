var neo = require('neo4j');
var db = new neo.GraphDatabase('http://localhost:7474');

exports.masters = function(req, res) {
	db.query('MATCH (p:Person)\nRETURN p', function(err, data) {
		var results = [];
		forEach(data, function(item) {
			results.push(item.p._data.data);
		})
    console.log(results);
		res.json({data: results});
	})
}

/*'CREATE (n:Master {name: ({name}),surnames: ({surnames}),sex: ({sex}),birthDate: ({birthDate}),deathDate: ({deathDate}),birthCity: ({birthCity}),residCity: ({residCity}),deathCity: ({deathCity}) })'*/

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
  if (params.deathDate) {
    query += 'deathDate: ({deathDate}),';
  }
  query += 'birthCity: ({birthCity}), residCity: ({residCity})'; 
  if (params.deathCity) {
    query += ', deathCity: ({deathCity}) })';
  }
  else {
    query += ' })';
  }
  console.log(query);
	db.query(query, params, function (err) {
		if(err) {
      console.log("Ha salido mal");
      res.json(false); 
    }
    else {
      console.log("Ha salido bien");
			res.json(true);
		}
	})
}

exports.chain = function(req, res) {
  var params = {name: req.params.id},
  results = [];
  db.query('MATCH (n:Master)-[:CHILD_OF*1..]-(l:Child)\nWHERE n.name = ({name})\nRETURN l',params, function (err, data) {
    if(err) { console.log(err); } else {
      forEach(data, function (item, i) {
        results.push({name: item.l._data.data.name, distance: i});
      })
      res.json({data: results});
    }
  })
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
        db.query(Query,params, function(err, data) {
            if(err) {console.log('second query: ' + err);} else {
              res.json(true);
            }
          })
      }
    })
}

exports.deleteNode = function(req, res) {
  var params = {name: req.params.id};
  console.log(params);
  var qPerson = 'MATCH (p:Person {name: ({name}) })\n DELETE p';
      qPersonChildren = 'MATCH (p:Person { name: ({name}) })-[r]-()\nDELETE p, r';
  var query_func = function (err) {
      if (err) {
        console.log("Error Q2");
        res.json(false);
      }
        else {res.json(true);}
  };
  db.query('MATCH (p:Person)-[:CHILD_OF*1..]-(l:Child)\nWHERE p.name = ({name})\nRETURN l', params,
    function (err, data) {
      if (err) {
        console.log("Error");
        console.log(data);
      }
      else {
        if (data.length == 0) {db.query(qMaster, params, query_func);}
        else {db.query(qMasterChildren, params, query_func);}
      }
  });
}

function forEach(array, fn) {
  for(var i = 0; i < array.length; i++) {
    fn(array[i], i);
  }
}