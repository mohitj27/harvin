var bodyParser = require("body-parser"),
   express = require("express"),
   mongoose = require("mongoose"),
   passport = require("passport"),
   localStrategy = require("passport-local"),
   passportLocalMongoose = require("passport-local-mongoose"),
   session = require("express-session"),
   flash = require("connect-flash"),
   indexRoutes = require("./routes"),
   morgan = require("morgan"),
   fs = require('fs')
   config = require('./config')(),
   errorHandler = require('express-error-handler'),

  app = express(),
  conn = mongoose.connection,
  Schema = mongoose.Schema,

  User = require("./models/User.js");

mongoose.Promise = Promise;

// development only
if ('development' == app.get('env')) {
  	app.use(errorHandler());
}

//========connection to database
var url = process.env.DATABASEURL || "mongodb://localhost/innov8";

mongoose.connect(url,{ useMongoClient: true }, function(err, db) {
    if(err) {
        console.log('Sorry, there is no mongo db server running.');
    } else {
        var attachDB = function(req, res, next) {
            req.db = db;
            next();
        };
        app.listen(config.port, function(){
            console.log("Server has started!!! Listening at " +config.port);
        });
    }
});

//
app.use(morgan("dev"));

//setting up body-parser
app.use(bodyParser.urlencoded({ extended: false }))
 
//flash
app.use(flash());

//view engine
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash());
app.use(bodyParser.json())
app.use(express.static( __dirname + "/public"));
app.use(session({
  secret: 'This is a secret phrase, it will be used for hashing the session id',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


//Setting local strategy for authentication of user
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware function 
app.use(function(req, res, next) {
  res.locals.currentUser = req.user || null;
  res.locals.msg_error = req.flash("error");
  res.locals.msg_success = req.flash("success");
  next();
});

app.use("/",indexRoutes);
