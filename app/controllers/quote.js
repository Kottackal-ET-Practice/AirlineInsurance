'use strict';
var request = require('request');
var Insurance = require('../models/insured');
var models = require('../models/weather');

exports.quoteCreate = function (req, res) {

    //Drop Collections
    models.Weather.collection.drop();
    models.Account.collection.drop();

    //Define the variables for input
    var source = req.body.source;
    var destination = req.body.destination;
    var persons = req.body.persons;
    var date = req.body.date;
    var time1 = req.body.time;

    //Declare global variables
    var time;
    var check;
    var datetime;

    timeConversion(); //Function for time conversion
    userInputValidation(); //Function for user input validation

    //Sets 'check' flag as 1 for succesful validation
    if (check == 1) {
        var timeperiod; //Define for storing time range
        //Finds Time range period for user input time
        if ((time >= '00:00:00') && (time < '03:00:00')) {
            timeperiod = '00:00:00';
        } else if ((time >= '03:00:00') && (time < '06:00:00')) {
            timeperiod = '03:00:00';
        } else if ((time >= '06:00:00') && (time < '09:00:00')) {
            timeperiod = '06:00:00';
        } else if ((time >= '09:00:00') && (time < '12:00:00')) {
            timeperiod = '09:00:00';
        } else if ((time >= '12:00:00') && (time < '15:00:00')) {
            timeperiod = '12:00:00';
        } else if ((time >= '15:00:00') && (time < '18:00:00')) {
            timeperiod = '15:00:00';
        } else if ((time >= '18:00:00') && (time < '21:00:00')) {
            timeperiod = '18:00:00';
        } else if ((time >= '21:00:00') && (time < '24:00:00')) {
            timeperiod = '21:00:00';
        }
        //Combine date and time
        datetime = date + ' ' + timeperiod;
        //Insert Documents into 'Weather' Collection
        weatherCollectionCreation(destination);
        //Insert Documents into 'Account' Collection
        accountCollectionCreation('Trivandrum', 'Mumbai', 1000);
        accountCollectionCreation('Trivandrum', 'Delhi', 1500);
        accountCollectionCreation('Banglore', 'Kochi', 2500);
        accountCollectionCreation('Banglore', 'Chennai', 2000);
        accountCollectionCreation('London', 'Genneva', 5000);
        accountCollectionCreation('Zurich', 'Frankfurt', 6000);
        //Define function for implementing business logic
        var quoteGeneration = function () {

            //Find weather condition from 'Weather' collection with respect to  Date & Time
            console.log('date and time for retrieving condition ' + datetime);
            models.Weather.findOne({
                "list.dt_txt": datetime
            }, function (err, data) {
                if (err)
                    return console.error(err);
                var weathercondition = data.list['description']; //Assign condition in 'weathercondition'
                //Find Amount from 'Account' Collection with respect to Source & Destination
                models.Account.findOne({
                    "source": source,
                    "destination": destination
                }, function (err, data) {
                    if (err) return console.error(err);
                    var amount = data.amount; //Assign amount in 'amount'
                    var noofusers = persons; //Assign persons in 'noofusers'
                    console.log('xxxxxxVerifyxxxAmountxxxxxxx');
                    console.log('Amount: ' + amount);
                    console.log('Condition: ' + weathercondition);
                    console.log('No of Users: ' + noofusers);
                    console.log('xxxxxVerifyxxxxAmountxxxxxxx');
                    var quote = 0; // Assign for quote amount
                    //Checks Weather Conditions
                    if (weathercondition == 'moderate rain') {
                        quote = amount + (10 / 100);
                    } else if (weathercondition == 'light rain') {
                        quote = amount + (8 / 100);
                    } else if (weathercondition == 'overcast clouds') {
                        quote = amount + (6 / 100);
                    } else if (weathercondition == 'broken clouds') {
                        quote = amount + (4 / 100);
                    } else if (weathercondition == 'scattered clouds') {
                        quote = amount + (2 / 100);
                    } else {
                        quote = amount;
                    }
                    //Checks noofusers
                    if (noofusers >= 3) {
                        quote = quote - (15 / 100);
                    } else if (noofusers == 2) {
                        quote = quote - (10 / 100);
                    } else {
                        quote = quote;
                    }
                    //Sends Amount
                    console.log('Exact Amount to be paid ' + quote);
                    res.json({
                        success: true,
                        message: 'Total Quote',
                        total: quote
                    });

                });

            });


        };
        setTimeout(quoteGeneration, 2000);

    }
    //Function for TimeConversion
    function timeConversion() {

        time1 = time1 + ' ';
        //Define hours
        var hours = Number(time1.match(/^(\d+)/)[1]);
        //Define minutes
        var minutes = Number(time1.match(/:(\d+)/)[1]);
        var sHours;
        var sMinutes;
        //Case for hours>12
        if (hours > 12) {

            sHours = hours.toString();
            sMinutes = minutes.toString();
            if (minutes < 10) sMinutes = "0" + sMinutes;
            time = sHours + ":" + sMinutes + ":00";
            console.log('Time For Processing: ' + time);

        } else {
            //Define Variable for storing AM & PM
            var AMPM = time1.match(/\s(.*)$/)[1];
            if (AMPM == 'AM') {
                if (hours == 12)
                    hours = hours - 12;
                sHours = hours.toString();
                sMinutes = minutes.toString();
                if (hours < 10) sHours = "0" + sHours;
                if (minutes < 10) sMinutes = "0" + sMinutes;
                //set the variable time
                time = sHours + ":" + sMinutes + ":00";
                console.log('Time For Processing: ' + time);

            } else if (AMPM == 'PM') {
                if (hours < 12)
                    hours = hours + 12;
                sHours = hours.toString();
                sMinutes = minutes.toString();
                if (minutes < 10) sMinutes = "0" + sMinutes;
                //set the variable time
                time = sHours + ":" + sMinutes + ":00";
                console.log('Time For Processing: ' + time);

            } else {
                sHours = hours.toString();
                sMinutes = minutes.toString();
                if (hours < 10) sHours = "0" + sHours;
                if (minutes < 10) sMinutes = "0" + sMinutes;
                //set the variable time
                time = sHours + ":" + sMinutes + ":00";
                console.log('Time For Processing: ' + time);

            }

        }

    }
    //Function for validation
    function userInputValidation() {
        //Verify Null Values
        if (source == null || destination == null || persons == null || date == null || time1 == null) {

            console.log('Fill all Columns');
            res.json({
                success: false,
                message: 'Fill all Columns',

            });

        } else if (source && destination && persons && date && time) {

            //Checks Source & Destination
            if ((source == 'Trivandrum' || source == 'Banglore' || source == 'London' || source == 'Zurich') && (destination == 'Mumbai' || destination == 'Delhi' || destination == 'Kochi' || destination == 'Chennai' || destination == 'Genneva' || destination == 'Frankfurt')) {

                //Checks  source==Trivandrum
                if (source == 'Trivandrum') {
                    //Checks Destination for Source=Trivandrum
                    if (!((destination == 'Mumbai') || (destination == 'Delhi'))) {

                        console.log('Destination not Valid for Trivandrum');
                        res.json({
                            success: false,
                            message: 'Destination not valid for Trivandrum',

                        });

                    } else {
                        validationPersonsDateTime(persons, date, time); //Function call for verifying persons,date,time

                    }
                }
                //Checks source==Banglore
                else if (source == 'Banglore') {
                    if (!((destination == 'Kochi') || (destination == 'Chennai'))) {

                        //Checks Destination for Source=Banglore
                        console.log('Destination not Valid for Banglore');
                        res.json({
                            success: false,
                            message: 'Destination not Valid for Banglore',

                        });

                    } else {
                        validationPersonsDateTime(persons, date, time); //Function call for verifying persons,date,time

                    }

                }
                //Checks source=London
                else if (source == 'London') {
                    //Checks Destination Source=London
                    if (!(destination == 'Genneva')) {

                        console.log('Destination not Valid for Genneva');
                        res.json({
                            success: false,
                            message: 'Destination not Valid for Genneva',

                        });

                    } else {

                        validationPersonsDateTime(persons, date, time); //Function call for verifying persons,date,time

                    }

                }
                //Checks Source=Zurich
                else if (source == 'Zurich') {
                    //Checks destination for Source=Zurich
                    if (!(destination == 'Frankfurt')) {

                        console.log('Destination not Valid for Frankfurt');
                        res.json({
                            success: false,
                            message: 'Destination not Valid for Frankfurt',

                        });

                    } else {

                        validationPersonsDateTime(persons, date, time); //Function call for verifying persons,date,time

                    }

                }

            }
            //Verify Source and Destination
            else {
                console.log('Source and Destination is not as per requirement');
                res.json({
                    success: false,
                    message: 'Source and Destination is not as per requirement',

                });

            }

        }
    }
    //Function for verifying persons,date,time
    function validationPersonsDateTime(persons, date, time) {

        //Checks No: of Persons
        if (persons >= 1) {
            //Set Today's Date
            var now = new Date();
            var today = now.toISOString().slice(0, 10);
            //Increment today's Date
            now.setDate(now.getDate() + 4);
            var dateincrement = now.toISOString().slice(0, 10);
            //Checks date is within five days from current date
            if ((date >= today && date <= dateincrement)) {
                //Checks time
                if ((time >= '00:00:00') && (time <= '24:00:00')) {
                    if (date == today) {
                        //Fetch Current time
                        hours = (now.getHours() < 10 ? '0' : '') + now.getHours();
                        minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
                        currenttime = hours + ":" + minutes + ":00";
                        //Compare time is greater than current if date==today
                        if (time >= currenttime) {
                            console.log('Validation Passed');
                            check = 1; //Set flag
                        } else {
                            console.log('Validation not passed');
                            res.json({
                                success: false,
                                message: 'Time Not Passed',

                            });
                        }

                    } else {
                        console.log('Validation passed');
                        check = 1; //Set flag

                    }

                } else {
                    console.log('Time not Valid');
                    res.json({
                        success: false,
                        message: 'Time Not Valid',

                    });

                }

            } else {
                console.log('Date not Valid');
                res.json({
                    success: false,
                    message: 'Date Not Valid',

                });

            }

        } else {
            console.log('Persons Count is not Valid');
            res.json({
                success: false,
                message: 'Persons Count is not valid',

            });

        }

    }
    //Function for Creating Account Collection
    function accountCollectionCreation(source, destination, amount) {

        var account = new models.Account();
        account.source = source;
        account.destination = destination;
        account.amount = amount;
        account.save(function (err, body) {
            if (err || !body) {
                console.log(err);
            }

        });

    }

    //Function for Creating Weather Collection
    function weatherCollectionCreation(destination) {

        //Fetch from Weather API w.r.t User's Destination
        request('http://api.openweathermap.org/data/2.5/forecast?q=' + destination + '&mode=json&APPID=d2e8279188c8649c17540f798c9cc972', function (error, response, body) {
            var weatherinfo = JSON.parse(body);
            var weatherinfocount = weatherinfo.list.length; //Store the count of weather details fetched
            //Insert weathers details into 'Weather' Collection
            for (var i = 0; i < weatherinfocount; i++) {
                var weather = new models.Weather();
                weather.city.id = weatherinfo.city.id;
                weather.city.name = weatherinfo.city.name;
                weather.city.country = weatherinfo.city.country;
                weather.list.id = weatherinfo.list[i]["weather"][0]["id"];
                weather.list.main = weatherinfo.list[i]["weather"][0]["main"];
                weather.list.description = weatherinfo.list[i]["weather"][0]["description"];
                weather.list.dt_txt = weatherinfo.list[i]["dt_txt"];
                weather.save(body, function (err, body) {
                    if (err || !body) {
                        console.log(err);
                    }
                });
            }

        });


    }
};