
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var multer = require('multer');
var http = require('http');
var path = require('path');
var api = require('./routes/api');
var done = false;
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer

app.use(multer({ dest: './uploads/',
	rename: function(fieldname, filename) {
    	return filename+Date.now();
 	},
	onFileUploadStart: function(file) {
  		console.log(file.originalname + ' is starting...');
 	},
	onFileUploadComplete: function(file) {
  		console.log(file.fieldname + ' uploaded to  ' + file.path);
  		done = true;
 	}}
));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routing
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// APIs
app.get('/api/allPersons', api.allPersons);
app.post('/api/newPerson', api.newPerson);
app.get('/api/nodeData/:id', api.nodeData);
app.post('/api/editNode/:id', api.editNode);
app.post('/api/newChild/:id', api.newChild);
app.post('/api/deleteNode/:id', api.deleteNode);
app.post('/api/uploadFile', function (req, res) {
  if (done == true) {
    console.log(req.files);
    res.end("File uploaded.")
  }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
