/*
APP NAME: Grocery Tracker
CREATED BY: Blake Hefley
CREATED DATE: July 23rd, 2016
UPDATED DATE: July 26th, 2016
LAST UPDATED BY: Blake Hefley
CONTRIBUTING DEVELOPERS: Blake Hefley
*/

//call express
var express    = require('express');

//define the app using express
var app        = express();

// configure app to use bodyParser() for getting POST data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Set port
var port = process.env.PORT || 8080;

//Connect to Mongo database
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/GroceryTracker');

//Get an instance of the express Router
var router = express.Router();

//Include 'users' Route
require('./users-api-route')(router);
require('./ingredient-api-route')(router);

// all routes will be prefixed with /api
app.use('/api', router);

//Start the server
app.listen(port);

//log output port
console.log('Magic happens on port ' + port);