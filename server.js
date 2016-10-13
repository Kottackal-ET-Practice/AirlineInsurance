// Whole-script strict mode syntax
'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var compression = require('compression');


var config      = require('./config');

var app         = express();

var oneDay      = 86400000;

// 
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Gzip compressing 
app.use(compression());

// log every request to the console
app.use(morgan('dev'));

// For serving static assets
app.use(express.static(__dirname + '/public',{ maxAge: oneDay }));

// For serving static assets
app.use(express.static(__dirname + '/bower_components'));


var api = require('./app/routes/api')(app, express);

app.use('/api', api);

//

app.get('*', function(req,res){
res.sendFile(__dirname + '/public/app/views/index.html');
});

// Establish connection to mongodb
mongoose.connect(config.database + config.databaseName, function (err) {
    if (err)
        throw err;
    else
        console.log('Database Connected');
});

// Start Server
var myserver = app.listen(config.port, config.host, function () {
    var host = myserver.address().address;
    var port = myserver.address().port;
    console.log('Server running at http://%s:%s', host, port);
});