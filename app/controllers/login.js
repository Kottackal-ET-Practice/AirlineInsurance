// Whole-script strict mode syntax
'use strict';

var User = require('../models/login'); // User Schema
var createToken = require('./createtoken').createToken;


exports.signin = function (req, res) {

    User.findOne({
        username: req.body.username //User name from input feild
    }).select('name username password').exec(function (err, user) {

        if (err) throw err;

        // Check for user existence
        if (!user) {

            res.send({
                message: "User doesn't exist"
            });

        }
        // Check for  password matching
        else if (user) {

            // Bcrypt password comparsion ( Return true if matches )
            var validPassword = user.comparePassword(req.body.password);

            // If the password doesn't match
            if (!validPassword) {

                res.send({
                    message: "Invalid Password"
                });

            }
            // If the password matches
            else {

                //token
                var token = createToken(user);

                res.json({
                    success: true,
                    message: "Successfly login",
                    token: token
                });

            }
        }
    });
};