var User = require('../models/login');
var Insurance = require('../models/insured');
var models = require('../models/weather');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');
var request = require('request');

// Token Creation
function createToken(user) {

    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresIn: 1440
    });

    return token;
}

// API
module.exports = function (app, express) {

    // Create route handlers
    var api = express.Router();

    // Registeration
    api.post('/signup', function (req, res) {

        var user = new User({

            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            dob: req.body.dob,
            country: req.body.country,
            gender: req.body.gender

        });

        var token = createToken(user);

        user.save(function (err) {

            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: 'User has been created',
                token: token
            });

        });

    });

    // quote
    api.post('/quote', function (req, res) {

        //Drop Collections
        models.Weather.collection.drop();
        models.Account.collection.drop();


        //Set the values
        var source = req.body.source;
        var destination = req.body.destination;
        var persons = req.body.persons;
        var date = req.body.date;
        var time1 = req.body.time;
        //Declare global variables
        var time;
        var check;

        //Verify Null Values
        if (source === null || destination === null || persons === null || date === null || time1 === null) {

            console.log('Fill all Columns');
            res.json({
                success: false,
                message: 'Fill all Columns',

            });

        } else if (source && destination && persons && date && time1) {

            //set hour value
            var h_24 = Number(time1.match(/^(\d+)/)[1]);
            //Time Conversion
            var h = h_24 % 12;
            if (h === 0) h = 12;
            console.log('Time: ');
            console.log((h < 10 ? '0' : '') + h + ':00 ' + (h_24 < 12 ? 'AM' : 'PM'));
            time2 = (h < 10 ? '0' : '') + h + ':00 ' + (h_24 < 12 ? 'AM' : 'PM');
            var hours = Number(time2.match(/^(\d+)/)[1]);
            var minutes = Number(time2.match(/:(\d+)/)[1]);
            var AMPM = time2.match(/\s(.*)$/)[1];
            if (AMPM == "PM" && hours < 12) hours = hours + 12;
            if (AMPM == "AM" && hours == 12) hours = hours - 12;
            var sHours = hours.toString();
            var sMinutes = minutes.toString();
            if (hours < 10) sHours = "0" + sHours;
            if (minutes < 10) sMinutes = "0" + sMinutes;
            console.log(sHours + ":" + sMinutes + ":00");
            //set the variable time
            time = sHours + ":" + sMinutes + ":00";
            console.log('Time For Processing: ' + time);

            //Checks Source & Destination

            if (source && destination) {

                if ((source == 'Trivandrum' || source == 'Banglore' || source == 'London' || source == 'Zurich') && (destination == 'Mumbai' || destination == 'Delhi' || destination == 'Kochi' || destination == 'Chennai' || destination == 'Genneva' || destination == 'Frankfurt')) {

                    //Checks Source
                    if (source == 'Trivandrum') {
                        //Checks Destination
                        if (!((destination == 'Mumbai') || (destination == 'Delhi'))) {

                            console.log('Destination Not Match1');
                            res.json({
                                success: false,
                                message: 'Destination Not Match',

                            });


                        } else {
                            console.log('Destination Match1');
                            //Checks No: of Persons
                            if (persons) {
                                if (persons >= 1) {
                                    console.log('Persons Count Valid');
                                    if (date) {
                                        //Set Today's Date
                                        var d = new Date().toISOString().slice(0, 10);
                                        console.log('Current Date' + d);
                                        //Increment today's Date
                                        var now = new Date();
                                        now.setDate(now.getDate() + 4);
                                        console.log(now);
                                        var dnew = now.toISOString().slice(0, 10);
                                        console.log(dnew);
                                        console.log(date);
                                        //Checks dates
                                        if ((date >= d && date <= dnew)) {
                                            console.log('Date Validd');
                                            //Checks time
                                            if (time) {
                                                if ((time >= '00:00:00') && (time <= '24:00:00')) {

                                                    var dk = new Date().toISOString().slice(0, 10);
                                                    console.log('current date:' + dk);
                                                    //Compare date
                                                    if (dk == date) {

                                                        var d = new Date(),
                                                            h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
                                                            m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                                                        currenttime = h + ":" + m + ":00";
                                                        console.log(currenttime);
                                                        console.log(time);
                                                        //Compare time
                                                        if (time >= currenttime) {
                                                            console.log('passed');
                                                            console.log('Time Valid');
                                                            check = 1; //Set flag
                                                        } else {
                                                            console.log('not passed');
                                                            res.json({
                                                                success: false,
                                                                message: 'Time Not Passed',

                                                            });
                                                        }

                                                    } else if (date > dk) {
                                                        console.log('passed');
                                                        console.log('Time Valid');
                                                        check = 1; //Set flag

                                                    }


                                                } else {
                                                    console.log('Time not Valid');
                                                    res.json({
                                                        success: false,
                                                        message: 'Time Not Valid',

                                                    });

                                                }

                                            }




                                        } else {
                                            console.log('Date not Valid');
                                            res.json({
                                                success: false,
                                                message: 'Date Not Valid',

                                            });

                                        }
                                    }

                                } else {
                                    console.log('Persons Count not Valid');
                                    res.json({
                                        success: false,
                                        message: 'Persons count not valid',

                                    });

                                }
                            }



                        }
                    }
                    //Checks source==Trivandrum
                    else if (source == 'Banglore') {
                        if (!((destination == 'Kochi') || (destination == 'Chennai'))) {

                            //Checks Destination
                            console.log('Destination Not Match2');
                            res.json({
                                success: false,
                                message: 'Destination Not Match2',

                            });

                        } else {
                            console.log('Destination Match2');
                            if (persons) {
                                //Checks no: of Persons
                                if (persons >= 1) {
                                    console.log('Persons Count Valid');
                                    if (date) {
                                        //Set Today's Date
                                        var d = new Date().toISOString().slice(0, 10);
                                        console.log('Current Date' + d);
                                        //Increment Today's date
                                        var now = new Date();
                                        now.setDate(now.getDate() + 4);
                                        console.log(now);
                                        var dnew = now.toISOString().slice(0, 10);
                                        console.log(dnew);
                                        console.log(date);
                                        //Compare dates
                                        if ((date >= d && date <= dnew)) {
                                            console.log('Date Validd');
                                            //Checks time
                                            if (time) {
                                                if ((time >= '00:00:00') && (time <= '24:00:00')) {
                                                    var dk = new Date().toISOString().slice(0, 10);
                                                    console.log('current date:' + dk);
                                                    //Compare dates
                                                    if (dk == date) {

                                                        var d = new Date(),
                                                            h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
                                                            m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                                                        currenttime = h + ":" + m + ":00";
                                                        console.log(currenttime);
                                                        console.log(time);
                                                        //Compare time
                                                        if (time >= currenttime) {
                                                            console.log('passed');
                                                            console.log('Time Valid');
                                                            check = 1; //Set flag
                                                        } else {
                                                            console.log('not passed');
                                                            res.json({
                                                                success: false,
                                                                message: 'Time Not Passed',

                                                            });
                                                        }

                                                    } else if (date > dk) {
                                                        console.log('passed');
                                                        console.log('Time Valid');
                                                        check = 1; //Set flag

                                                    }


                                                } else {
                                                    console.log('Time not Valid');
                                                    res.json({
                                                        success: false,
                                                        message: 'Time Not Valid',

                                                    });

                                                }

                                            }




                                        } else {
                                            console.log('Date not Valid');
                                            res.json({
                                                success: false,
                                                message: 'Date Not Valid',

                                            });

                                        }
                                    }

                                } else {
                                    console.log('Persons Count not Valid');
                                    res.json({
                                        success: false,
                                        message: 'Persons Count Not Valid',

                                    });

                                }
                            }


                        }

                    }
                    //Checks source=London
                    else if (source == 'London') {
                        //Checks Destination
                        if (!(destination == 'Genneva')) {

                            console.log('Destination Not Match3');
                            res.json({
                                success: false,
                                message: 'Destination Not Match3',

                            });

                        } else {
                            console.log('Destination Match3');
                            //Checks no of persons
                            if (persons) {
                                if (persons >= 1) {
                                    console.log('Persons Count Valid');
                                    if (date) {
                                        //Checks Today's Date
                                        var d = new Date().toISOString().slice(0, 10);
                                        console.log('Current Date' + d);
                                        //Increment today's Date
                                        var now = new Date();
                                        now.setDate(now.getDate() + 4);
                                        console.log(now);
                                        var dnew = now.toISOString().slice(0, 10);
                                        console.log(dnew);
                                        console.log(date);

                                        //Checks Dates
                                        if ((date >= d && date <= dnew)) {
                                            console.log('Date Validd');
                                            //Checks time

                                            if (time) {
                                                if ((time >= '00:00:00') && (time <= '24:00:00')) {
                                                    var dk = new Date().toISOString().slice(0, 10);
                                                    console.log('current date:' + dk);
                                                    //Compare dates
                                                    if (dk == date) {

                                                        var d = new Date(),
                                                            h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
                                                            m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                                                        currenttime = h + ":" + m + ":00";
                                                        console.log(currenttime);
                                                        console.log(time);
                                                        //Compare time
                                                        if (time >= currenttime) {
                                                            console.log('passed');
                                                            console.log('Time Valid');
                                                            check = 1; //Set flag
                                                        } else {
                                                            console.log('not passed');
                                                            res.json({
                                                                success: false,
                                                                message: 'Time Not Passed',

                                                            });
                                                        }

                                                    } else if (date > dk) {
                                                        console.log('passed');
                                                        console.log('Time Valid');
                                                        check = 1; //Set flag

                                                    }


                                                } else {
                                                    console.log('Time not Valid');
                                                    res.json({
                                                        success: false,
                                                        message: 'Time Not Valid',

                                                    });

                                                }

                                            }




                                        } else {
                                            console.log('Date not Valid');
                                            res.json({
                                                success: false,
                                                message: 'Date Not Valid',

                                            });

                                        }
                                    }

                                } else {
                                    console.log('Persons Count not Valid');
                                    res.json({
                                        success: false,
                                        message: 'Persons Count Not Valid',

                                    });

                                }
                            }


                        }


                    }
                    //Checks Source=Zurich
                    else if (source == 'Zurich') {
                        //Checks destination
                        if (!(destination == 'Frankfurt')) {

                            console.log('Destination Not Match4');
                            res.json({
                                success: false,
                                message: 'Destination Not Match4',

                            });

                        } else {
                            console.log('Destination Match4');
                            if (persons) {
                                //Checks no: of persons
                                if (persons >= 1) {
                                    console.log('Persons Count Valid');
                                    if (date) {
                                        //Check Today's Date
                                        var d = new Date().toISOString().slice(0, 10);
                                        console.log('Current Date' + d);
                                        //Increment Today's Date
                                        var now = new Date();
                                        now.setDate(now.getDate() + 4);
                                        console.log(now);
                                        var dnew = now.toISOString().slice(0, 10);
                                        console.log(dnew);
                                        console.log(date);
                                        //Checks dates

                                        if ((date >= d && date <= dnew)) {
                                            console.log('Date Validd');
                                            //Checks time

                                            if (time) {
                                                if ((time >= '00:00:00') && (time <= '24:00:00')) {
                                                    var dk = new Date().toISOString().slice(0, 10);
                                                    console.log('current date:' + dk);
                                                    //Compare date
                                                    if (dk == date) {

                                                        var d = new Date(),
                                                            h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
                                                            m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                                                        currenttime = h + ":" + m + ":00";
                                                        console.log(currenttime);
                                                        console.log(time);
                                                        //Compare time
                                                        if (time >= currenttime) {
                                                            console.log('passed');
                                                            console.log('Time Valid');
                                                            check = 1; //Set flag
                                                        } else {
                                                            console.log('not passed');
                                                            res.json({
                                                                success: false,
                                                                message: 'Time Not Passed',

                                                            });
                                                        }

                                                    } else if (date > dk) {
                                                        console.log('passed');
                                                        console.log('Time Valid');
                                                        check = 1; //Set flag

                                                    }

                                                } else {
                                                    console.log('Time not Valid');
                                                    res.json({
                                                        success: false,
                                                        message: 'Time Not Valid',

                                                    });

                                                }

                                            }

                                        } else {
                                            console.log('Date not Valid');
                                            res.json({
                                                success: false,
                                                message: 'Date Not Valid',

                                            });

                                        }
                                    }

                                } else {
                                    console.log('Persons Count not Valid');
                                    res.json({
                                        success: false,
                                        message: 'Persons Count not valid',

                                    });

                                }
                            }


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

        //Verify value
        if (check == 1) {


            //Printing Values
            console.log('User Input Values :-');
            console.log(req.body.source);
            console.log(req.body.destination);
            console.log(req.body.persons);
            console.log(req.body.date);
            console.log(req.body.time);




            var x = req.body.date; //Set x as date of journey
            console.log(time);
            var q = time; //Set q as time of journey
            console.log(q);
            var y; //Define y for storing time range
            //Finds Time range period
            if ((q >= '00:00:00') && (q < '03:00:00')) {
                console.log('Time range: ' + '00:00:00');
                y = '00:00:00';
            } else if ((q >= '03:00:00') && (q < '06:00:00')) {
                console.log('Time range: ' + '03:00:00');
                y = '03:00:00';
            } else if ((q >= '06:00:00') && (q < '09:00:00')) {
                console.log('Time range: ' + '06:00:00');
                y = '06:00:00';
            } else if ((q >= '09:00:00') && (q < '12:00:00')) {
                console.log('Time range: ' + '09:00:00');
                y = '09:00:00';
            } else if ((q >= '12:00:00') && (q < '15:00:00')) {
                console.log('Time range: ' + '12:00:00');
                y = '12:00:00';
            } else if ((q >= '15:00:00') && (q < '18:00:00')) {
                console.log('Time range: ' + '15:00:00');
                y = '15:00:00';
            } else if ((q == '18:00:00') && (q < '21:00:00')) {
                console.log('Time range: ' + '18:00:00');
                y = '18:00:00';
            } else if ((q >= '21:00:00') && (q < '24:00:00')) {
                console.log('Time range: ' + '21:00:00');
                y = '21:00:00';
            }

            //Combine date and time
            z = x + ' ' + y;
            console.log('date & time: ' + z);


            //Fetch from Weather API w.r.t User's Destination
            request('http://api.openweathermap.org/data/2.5/forecast?q=' + req.body.destination + '&mode=json&APPID=d2e8279188c8649c17540f798c9cc972', function (error, response, body) {
                if (!error && response.statusCode == 200) {

                }
                console.log('URL: ' + 'http://api.openweathermap.org/data/2.5/forecast?q=' + req.body.destination + '&mode=json&APPID=d2e8279188c8649c17540f798c9cc972');
                var info = JSON.parse(body);
                console.log('No: of Weather details fetched: ' + info.list.length);
                var n = info.list.length; //Store the count of details fetched
                //Insert weathers details into 'Weather' Collection
                for (i = 0; i < n; i++) {
                    var weather = new models.Weather();
                    weather.city.id = info.city.id;
                    weather.city.name = info.city.name;
                    weather.city.country = info.city.country;
                    weather.list.id = info.list[i]["weather"][0]["id"];
                    weather.list.main = info.list[i]["weather"][0]["main"];
                    weather.list.description = info.list[i]["weather"][0]["description"];
                    weather.list.dt_txt = info.list[i]["dt_txt"];
                    weather.save(body, function (err, body) {
                        if (err || !body) {
                            console.log(err);
                        }
                    });
                }

            });


            //Create 'Account' Collection
            //Document 1
            var account = new models.Account();
            account.source = 'Trivandrum';
            account.destination = 'Mumbai';
            account.amount = 1000;
            account.save(function (err, body) {
                if (err || !body) {
                    console.log(err);
                } else {
                    console.log('Data successfully inserted');
                }
            });
            //Document 2
            account = new models.Account();
            account.source = 'Trivandrum';
            account.destination = 'Delhi';
            account.amount = 1500;
            account.save(function (err, body) {
                if (err || !body) {
                    console.log(err);
                } else {
                    console.log('Data successfully inserted');
                }
            });
            //Document 3
            account = new models.Account();
            account.source = 'Banglore';
            account.destination = 'Kochi';
            account.amount = 2500;
            account.save(function (err, body) {
                if (err || !body) {
                    console.log(err);
                } else {
                    console.log('Data successfully inserted');
                }
            });
            //Document 4
            account = new models.Account();
            account.source = 'Banglore';
            account.destination = 'Chennai';
            account.amount = 2000;
            account.save(function (err, body) {
                if (err || !body) {
                    console.log(err);
                }

            });
            //Document 5
            account = new models.Account();
            account.source = 'London';
            account.destination = 'Genneva';
            account.amount = 5000;
            account.save(function (err, body) {
                if (err || !body) {
                    console.log(err);
                }

            });
            //Document 6
            account = new models.Account();
            account.source = 'Zurich';
            account.destination = 'Frankfurt';
            account.amount = 6000;
            account.save(function (err, body) {
                if (err || !body) {
                    console.log(err);
                }

            });


            //Define Asynchronous Function
            var samplefunction = function () {
                //Count documents in 'Weather' Collection
                models.Weather.count({}, function (err, count) {
                    console.log('No: of Weather Documents Created:-' + count);

                });
                console.log('date and time for retrieving condition ' + z);
                //Find condition from 'Weather' collection w.r.t Date & Time
                models.Weather.findOne({
                    "list.dt_txt": z
                }, function (err, data) {
                    if (err)
                        return console.error(err);
                    console.log('Weather Details: ' + data);
                    console.log('Weather condition at Destination: ' + data.list['description']);
                    var weathercondition = data.list['description'];
                    //Find Amount from 'Account' Collection w.r.t Source & Destination
                    models.Account.findOne({
                        "source": req.body.source,
                        "destination": req.body.destination
                    }, function (err, data) {
                        if (err) return console.error(err);
                        var noofusers = req.body.persons;
                        console.log('xxxxxxVerifyxxxAmountxxxxxxx');
                        console.log('Amount: ' + data.amount);
                        console.log('Condition: ' + weathercondition);
                        console.log('No of Users: ' + noofusers);
                        console.log('xxxxxVerifyxxxxAmountxxxxxxx');
                        var x = 0; //For storing Amount
                        //Case for noofusers greater than or equals to 3
                        if (noofusers >= 3) {
                            //Checks Weather Conditions
                            if (weathercondition == 'moderate rain') {
                                x = data.amount + (10 / 100) - (15 / 100);
                            } else if (weathercondition == 'light rain') {
                                x = data.amount + (8 / 100) - (15 / 100);
                            } else if (weathercondition == 'overcast clouds') {
                                x = data.amount + (6 / 100) - (15 / 100);
                            } else if (weathercondition == 'broken clouds') {
                                x = data.amount + (4 / 100) - (15 / 100);
                            } else if (weathercondition == 'scattered clouds') {
                                x = data.amount + (2 / 100) - (15 / 100);
                            } else {
                                x = data.amount - (15 / 100);
                            }

                        } else if (noofusers == 2) {
                            //Checks Weather Conditions
                            if (weathercondition == 'moderate rain') {
                                x = data.amount + (10 / 100) - (10 / 100);
                            } else if (weathercondition == 'light rain') {
                                x = data.amount + (8 / 100) - (10 / 100);
                            } else if (weathercondition == 'overcast clouds') {
                                x = data.amount + (6 / 100) - (10 / 100);
                            } else if (weathercondition == 'broken clouds') {
                                x = data.amount + (4 / 100) - (10 / 100);
                            } else if (weathercondition == 'scattered clouds') {
                                x = data.amount + (2 / 100) - (10 / 100);
                            } else {
                                x = data.amount - (10 / 100);
                            }

                        }
                        //Case for noofusers equals to 1
                        else if (noofusers == 1) {
                            //Checks Weather Conditions
                            if (weathercondition == 'moderate rain') {
                                x = data.amount + (10 / 100);
                            } else if (weathercondition == 'light rain') {
                                x = data.amount + (8 / 100);
                            } else if (weathercondition == 'overcast clouds') {
                                x = data.amount + (6 / 100);
                            } else if (weathercondition == 'broken clouds') {
                                x = data.amount + (4 / 100);
                            } else if (weathercondition == 'scattered clouds') {
                                x = data.amount + (2 / 100);
                            } else {
                                x = data.amount;
                            }

                        }
                        //Sends Amount
                        console.log('Exact Amount to be paid ' + x);
                        res.json({
                            success: true,
                            message: 'Total amount',
                            total: x
                        });

                    });

                });

            };

            setTimeout(samplefunction, 6000);
        }

    });

    // To get all users
    api.get('/users', function (req, res) {

        User.find({}, function (err, users) {

            if (err) {
                res.send(err);
                return;
            }
            res.json(users);

        });

    });

    // Login
    api.post('/login', function (req, res) {

        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function (err, user) {

            if (err) throw err;

            if (!user) {

                res.send({
                    message: "User doesn't exist"
                });

            } else if (user) {

                var validPassword = user.comparePassword(req.body.password);

                if (!validPassword) {

                    res.send({
                        message: "Invalid Password"
                    });

                } else {

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
    });

    // Middleware for token Authentication
    api.use(function (req, res, next) {

        console.log("Somebody just came to our app!");

        // var token = req.body.token || req.params.token || req.query.token || req.headers['x-access-token'];
        var token = req.query['x-access-token'] || req.headers['x-access-token'];

        console.log("token: " + token);

        // check if token exist
        if (token) {
            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    res.status(403).send({
                        success: false,
                        message: "Failed to authenticate user"
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({
                success: false,
                message: "No token Provided"
            });
        }

    });

    // Destination B // provide a logitimate token

    api.get('/me', function (req, res) {
        res.json(req.decoded);
    });


    // Get Insurance Details

    api.get('/insured', function (req, res) {

        Insurance.find({}, function (err, insurances) {

            if (err) {
                res.send(err);
                return;
            }
            res.json(insurances);

        });

    });


    // Apply Insurance
    api.post('/insured', function (req, res) {

        var insurance = new Insurance({

            source: req.body.source,
            destination: req.body.destination,
            persons: req.body.persons,
            travelDate: req.body.date,
            travelTime: req.body.time,
            name: req.body.name,
            insured: req.body.insured
        });
        console.log('checking');
        console.log(req.body.name);
        console.log(req.body.insured);
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

    });


    return api;
};