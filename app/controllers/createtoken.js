// Whole-script strict mode syntax
'use strict';
var jsonwebtoken = require('jsonwebtoken'); //For webtoken creation
var config = require('../../config');
var secretKey = config.secretKey; // Key for token

exports.createToken = function (user) {
    
    // Create token with user name, id and user id
    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresIn: 1440 // expiry time for the token
    });

    return token;
};