// Configuration file for the application

'use strict';

module.exports = {
    // set the server port
    "port": process.env.PORT || 3000,
    // set the server host
    "host": "127.0.0.1",
    // adddress of the Database
    "database":"mongodb://localhost/",
    // Name of the Database
    "databaseName": "airlineInsurance",
    // Secret Key
    "secretKey":"YourSecretKey"
};