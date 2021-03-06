// Configuration file for the application

'use strict';

module.exports = {
    // set the http server port
    "httpPort": process.env.PORT || 9000,
    // set the http server port
    "httpsPort": process.env.PORT || 9030,
    // set the server host
    "host": "127.0.0.1",
    // adddress of the Database
    "database":"mongodb://localhost/",
    // Name of the Database
    "databaseName": "airlineInsurance",
    // Secret Key
    "secretKey":"YourSecretKey"
};