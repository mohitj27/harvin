var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var session = require("express-session");
var flash = require("connect-flash");
var adminRoutes = require("./routes/admin.js");
var studentRoutes = require("./routes/student.js");
var indexRoutes = require("./routes/index.js");
var morgan = require("morgan");

var app = express();
var conn = mongoose.connection;
var Schema = mongoose.Schema;

mongoose.Promise = Promise;

//========connection to database
var url = process.env.DATABASEURL || "mongodb://localhost/innov8";
// var url = process.env.DATABASEURL || "mongodb://gopal:151295@ds157342.mlab.com:57342/harvin";
mongoose.connect(url,{ useMongoClient: true });

conn.on("error", console.error.bind(console, "connection error"));
conn.once("open", function(callback) {
    console.log("Connection succeeded.");
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

// parse application/json 
app.use(bodyParser.json())

//serving public directory as static
app.use(express.static( __dirname + "/public"));

app.use(session({
  secret: 'This is a secret phrase, it will be used for hashing the session id',
  resave: false,
  saveUninitialized: false,
}));

//setting passport
app.use(passport.initialize());
app.use(passport.session());

//models and schema
var File = require("./models/File.js");
var Topic = require("./models/Topic.js");
var Chapter = require("./models/Chapter.js");
var Subject = require("./models/Subject.js");
var User = require("./models/User.js");

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

app.use("/admin/", adminRoutes);
app.use("/student", studentRoutes);
app.use("/",indexRoutes);

//Setting environment
app.listen((process.env.PORT || 3000), function(){
    console.log("Server has started!!! Listening at 3000...");
});