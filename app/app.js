var bodyParser = require("body-parser");
var express = require("express");
var fs = require('fs');
var path = require('path')
var mongoose = require("mongoose")
var multer = require('multer') 
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var session = require("express-session");
var flash = require("connect-flash");

var app = express();
var conn = mongoose.connection;
var Schema = mongoose.Schema;

mongoose.Promise = Promise;

//========connection to database
var url = "mongodb://localhost:27017/innov8";
mongoose.connect(url,{ useMongoClient: true });

conn.on("error", console.error.bind(console, "connection error"));
conn.once("open", function(callback) {
    console.log("Connection succeeded.");
});

//setting disk storage for uploaded files
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads')
	},
	filename: function(req, file, callback) {
		console.log(file)
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
});

//setting up body-parser
app.use(bodyParser.urlencoded({ extended: false }))
 
//flash
app.use(flash());

// parse application/json 
app.use(bodyParser.json())

//serving public directory as static
app.use(express.static("public"));

app.use(session({
  secret: 'This is a secret phrase, it will be used for hashing the session id',
  resave: false,
  saveUninitialized: false,
}));

//setting passport
app.use(passport.initialize());
app.use(passport.session());



//view engine
app.set("view engine", "ejs");

//====================SCHEMAS=========================

//file schema
var fileSchema = mongoose.Schema(
	{
		filePath: {
			type: String,
			required: true,
			trim: true
		},
		fileName: {
			type: String,
			required: true
		},
		uploadDate:{
			type:Date,
			default:Date.now
		},
		fileType:String
	}
);

//====topicSchema====
var topicSchema = new Schema(
	{
		topicName:String,
		files:[fileSchema]
	}
);

//====chapterSchema====
var chapterSchema = new Schema(
	{
		chapterName:String,
		topics:[topicSchema]
	}
);

//====subjectSchema====
var subjectSchema = new Schema(
	{
		subjectName:String,
		chapters:[chapterSchema]
	}
);


//User schema
var userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            mandatory:true
        },
        password: String
        
    }
);

//passport local mongoose
userSchema.plugin(passportLocalMongoose);



//===================DATA MODELS=====================

//file model
var File = mongoose.model("File", fileSchema);

//topic model
var Topic = mongoose.model("Topic", topicSchema);

//chapter model
var Chapter = mongoose.model("Chapter", chapterSchema);

//subject model
var Subject = mongoose.model("Subject", subjectSchema);

//exporting User model
var User = mongoose.model("User", userSchema);

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


//===================ROUTES======================

//Home
app.get("/", function(req, res){
	var jsondata = {"hello": "world"};
    res.render("home");
});

//Handle file upload
app.post('/', function(req, res) {
	var upload = multer({
		storage: storage
	}).single('userFile')
	upload(req, res, function(err) {
        //TODO: save the file URI in mongodb
		res.end('File is uploaded')
	})
})

//User registration form-- for admin
app.get("/admin/signup", function(req, res){
    res.render("signup");
});

//Handle user registration-- for admin
app.post("/admin/signup", function(req, res){
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.json(err);
        }

        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        });
    });
});

//Handle user registration-- for student
app.post("/student/signup", function(req, res){
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.json(err);
        }

        passport.authenticate("local")(req, res, function () {
            res.json(user);
        });
    });
});

//User login form-- admin
app.get("/admin/login", function(req, res){
    res.render("login",{error:res.locals.msg_error});
});

//User login form-- for student
app.get("/student/login", function(req, res){
	console.log(res.locals.msg_error);
    res.send({error:res.locals.msg_error});
});

//Handle user login -- for admin
app.post("/admin/login", passport.authenticate("local", 
    { 
        successRedirect: "/",
        failureRedirect: "/admin/login",
        successFlash:"Welcome back",
        failureFlash:true
    }),
    function(req, res) {
		
    }
);

//Handle user login -- for student
app.post("/student/login", passport.authenticate("local", 
    { 
        failureRedirect: "/student/login",
        successFlash:"Welcome back",
        failureFlash:true
    }),
    function(req, res) {
		res.json(req.user);
    }
);

//User logout-- admin
app.get("/admin/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//User logout-- student
app.get("/student/logout", function(req, res) {
    req.logout();
    res.json({"success":"You Logged out successfully"});
});

//Form for uploading a file
app.get('/uploadFile', function(req, res) {
	res.render('upload');
});

//if not route mentioned in url
app.get("*", function(req, res){
    res.send("No page found :(((((((");
})

//Setting environment
app.listen((process.env.PORT || 3000), function(){
    console.log("Server has started!!! Listening at 3000...");
});