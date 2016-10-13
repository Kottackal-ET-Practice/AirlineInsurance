// Database
// Whole-script strict mode syntax

"use strict";

var mongoose       = require('mongoose');

mongoose.Promise   = require('bluebird');

var collectionName = 'userCredentials'; // Name of the collection

var Schema         = mongoose.Schema; // mongoose schema object

var bcrypt         = require('bcrypt-nodejs'); // For encryption

// Email Validatoin
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

// Define Schema for mongodb
var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [15, 'name must be 15 chars in length or less']
    },
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    }, // user name is required and it must be unique
    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    dob: {
        type: Date,
        required: true
    },
    country: {
        type: String,
        required: true,
        maxlength: [15, 'name must be 15 chars in length or less']
    },
    gender: {
        type:String,
        required:true
    }
});

// Middleware 
// Check before save the UserSchema
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});

// Compare the password
UserSchema.methods.comparePassword = function (password) {

    var user = this;

    return bcrypt.compareSync(password, user.password);
};


// Export the module

module.exports = mongoose.model('User', UserSchema, collectionName);