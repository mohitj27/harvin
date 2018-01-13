var express = require("express"),
	bodyParser = require("body-parser"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	session = require("express-session"),
	flash = require("connect-flash"),
	indexRoutes = require("./routes"),
	morgan = require("morgan"),
	fs = require('fs'),
	path=require("path"),
	dotenv = require('dotenv').config(),
	config = require('./config')(process.env.LOAD_CONFIG),
	methodOverride = require("method-override"),
	compression=require('compression'),
	app = express(),
	mongoose = require("mongoose"),
	serveFavicon=require('serve-favicon'),

	Schema = mongoose.Schema,

	User = require("./models/User.js");

var url = process.env.DATABASEURL ||
	'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbName;
mongoose.connect(url, {
	useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function (err) {
	if (err) {
		console.log(err);
	} else {
		app.listen(process.env.PORT || config.port, function () {
			console.log("Server has started!!! Listening at " + config.port);
		});
	}

});

//setting up body-parser
app.use(bodyParser.urlencoded({
	extended: false
}));

//flash
app.use(flash());

//COMPRESSION
app.use(compression())

//APP favicon
app.use(serveFavicon(path.join(__dirname, 'public', 'output1.jpg')))


//view engine
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(morgan("common"));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(flash());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "./../../HarvinDb"));
app.use(methodOverride("_method"));
app.use(session({
	secret: 'This is a secret phrase, it will be used for hashing the session id',
	resave: false,
	saveUninitialized: false,
	cookie:{
		sameSite:true
	}
}));
app.use(passport.initialize());
app.use(passport.session());

//Setting local strategy for authentication of user
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// General middleware function

app.use(function (req, res, next) {
	res.locals.currentUser = req.user || null;
	res.locals.msg_error = req.flash("error") || {};
	res.locals.msg_success = req.flash("success") || {};
	next();
});


//index route
app.use("/", indexRoutes);

// Error handling middleware function
app.use(function (err, req, res, next) {
	if (err) {
		err.statusCode = err.statusCode || 500;
		res.status(err.statusCode);
		if ("development" === app.get("env")) {
			res.render('error', {
				name: err.name || "",
				message: err.message || "",
				statusCode: err.statusCode
			});
		} else {
			res.render('error', {
				name: "",
				message: err.message || "",
				statusCode: 0
			});
		}
	}
});
