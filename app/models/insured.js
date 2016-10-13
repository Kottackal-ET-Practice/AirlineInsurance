// Database
// Whole-script strict mode syntax

"use strict";

var mongoose       = require('mongoose');

mongoose.Promise   = require('bluebird');

var collectionName = 'userInsurance'; // Name of the collection

var Schema         = mongoose.Schema; // mongoose schema object


// Define Schema for mongodb
var InsuranceSchema = new Schema({
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    }, // user name is required and it must be unique
    persons: {
        type: String,
        required: true
    },
    travelDate: {
        type: String,
        required: true
    },
    travelTime: {
        type: String,
        required: true
    },
    name:{
        type:String
    },
    insured:{
        type:String
    }
});

// Export the module

module.exports = mongoose.model('Insurance', InsuranceSchema, collectionName);