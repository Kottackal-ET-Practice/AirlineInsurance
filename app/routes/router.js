// Whole-script strict mode syntax
'use strict';

//Initialize User Modules
var register = require('../controllers/register');
var login = require('../controllers/login');
var quote = require('../controllers/quote');
var authCheck = require('../controllers/middleware.authcheck');
var insurance = require('../controllers/insurance');


// API
module.exports = function (app, express) {

    // Create route handlers
    var api = express.Router();


    // User Registeration
    api.route('/signup')
        .post(function (req, res) {
            register.signup(req, res);
        });


    // Creating the quote
    api.route('/quote')
        .post(function (req, res) {
            quote.quoteCreate(req, res);
        });


    // User Login
    api.route('/login')
        .post(function (req, res) {
            login.signin(req, res);
        });

    // Middleware for token Authentication
    api.use(function (req, res, next) {

        authCheck.authenticationCheck(req, res, next);

    });


    // Destination B // provide a logitimate token

    api.get('/me', function (req, res) {
        res.json(req.decoded);
    });


    api.route('/insured')
        // Create insurance and store in Database
        .post(function (req, res) {
            insurance.createInsurance(req, res);
        })
        // Get Insurance Details from database
        .get(function (req, res) {
            insurance.getInsurances(req, res);
        });


    return api;
};