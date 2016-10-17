// Whole-script strict mode syntax
'use strict';

var Insurance = require('../models/insured');

// For getting insurance details from the database
exports.getInsurances = function (req, res) {

    Insurance.find({}, function (err, insurances) {

        if (err) {
            res.send(err);
            return;
        }
        res.json(insurances);

    });

};


// For the creation of insurance in the database

exports.createInsurance = function (req, res) {

    // Get the details from the from
    var insurance = new Insurance({

        source: req.body.source,
        destination: req.body.destination,
        persons: req.body.persons,
        travelDate: req.body.date,
        travelTime: req.body.time,
        name: req.body.name,
        insured: req.body.insured
    });

    // Store it to the database
    insurance.save(function (err) {

        if (err) {
            res.send(err);
            return;
        }
        res.json({
            success: true,
            message: 'insurance has been created'
        });

    });

};