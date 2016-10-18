// Whole-script strict mode syntax
'use strict';

// Initialization of modules
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var compression = require('compression');

var http = require('http');

var fs = require('fs');
var https = require('https'); // For creating HTTPS server
var path = require('path');

var config = require('./config');

var directoryToServe = '/public';

var app = express();

var oneDay = 86400000;

var httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
};

// For parsing the form values
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Gzip compressing 
app.use(compression());

// Log every request to the console
app.use(morgan('dev'));

// For serving static assets
app.use(express.static(__dirname + directoryToServe, {
    maxAge: oneDay
}));

// For serving static assets
app.use(express.static(__dirname + '/bower_components'));


// Checking for secure connection or not
// If not secure redirect to the secure connection
function requireHTTPS(req, res, next) {
    if (!req.secure) {
        //This should work for local development as well
        console.log(req.get('host'));
        return res.redirect('https://localhost:' + config.httpsPort + req.url);
    }
    next();
}


//For redirecting to https
app.use(requireHTTPS);

// Send request to the routes
var api = require('./app/routes/router')(app, express);

// Append the /api in front of all routes 
app.use('/api', api);

// For serving the index file
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/app/views/index.html');
});


// Establish connection to mongodb
mongoose.connect(config.database + config.databaseName, function (err) {
    if (err)
        throw err;
    else
        console.log('Database Connected');
});

// Start http Server
var server = http.createServer(app)
    .listen(config.httpPort, config.host, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Server running at http://%s:%s', host, port);
    });

// Start https server
var httpsServer = https.createServer(httpsOptions, app)
    .listen(config.httpsPort, config.host, function () {
        var host = httpsServer.address().address;
        var port = httpsServer.address().port;
        console.log('Server running at https://%s:%s', host, port);
    });