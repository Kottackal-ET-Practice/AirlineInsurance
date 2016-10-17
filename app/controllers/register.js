// Whole-script strict mode syntax
'use strict';

var User = require('../models/login');
var createToken = require('./createtoken').createToken;

exports.signup = function (req, res) {

    // Values from the registeration from
    var user = new User({

        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        dob: req.body.dob,
        country: req.body.country,
        gender: req.body.gender

    });

    var token = createToken(user); //Create a token

    // store the form details to database
    user.save(function (err) {

        if (err) {
            res.send(err);
            return;
        }
        res.json({
            success: true,
            message: 'User has been created',
            token: token // send the token
        });

    });

};