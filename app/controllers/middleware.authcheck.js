// Whole-script strict mode syntax
'use strict';

var jsonwebtoken = require('jsonwebtoken');
var config = require('../../config');
var secretKey = config.secretKey;


// Middleware for token Authentication

exports.authenticationCheck = function (req, res, next) {

    // var token = req.body.token || req.params.token || req.query.token || req.headers['x-access-token'];
    var token = req.query['x-access-token'] || req.headers['x-access-token'];

    // check if token exist
    if (token) {
        jsonwebtoken.verify(token, secretKey, function (err, decoded) {
            // If the authentication failed
            if (err) {
                res.status(403).send({
                    success: false,
                    message: "Failed to authenticate user"
                });
            } 
            // If the authentication is success
            else {
                req.decoded = decoded;
                next();
            }
        });
    } 
    // If there is no token provided
    else {
        res.status(403).send({
            success: false,
            message: "No token Provided"
        });
    }

};