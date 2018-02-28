var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  session = require("express-session"),
  flash = require("connect-flash"),
  morgan = require("morgan"),
  fs = require('fs'),
  blogRoutes = require("../app/routes/blog.js"),
  path = require("path"),
  dotenv = require('dotenv').config(),
  methodOverride = require("method-override"),
  compression = require('compression'),
  app = express(),
  mongoose = require("mongoose"),
  mysql = require('mysql'),

  serveFavicon = require('serve-favicon'),

  Schema = mongoose.Schema,

  User = require("../app/models/User.js"),
  http = require('http').Server(app),
  io = require('socket.io')(http)

let files = {},
  struct = {
    name: null,
    type: null,
    size: 0,
    data: [],
    slice: 0,
  };
io.on('connection', function(socket) {
  socket.on('end upload',()=>{files={}})
  socket.on('slice upload', (data) => {

    console.log('hello',data)
    if (!files[data.name]) {
      files[data.name] = Object.assign({}, struct, data)
      files[data.name].data = []
    }

    //convert the ArrayBuffer to Buffer
    data.data = new Buffer(new Uint8Array(data.data))
    //save the data


    fs.writeFile(__dirname + "/../../HarvinDb/blogImage/"+data.name, data.data, (err) => {
      console.log('err', err)
      console.log('files data',files[data.name])
      console.log('twice problem')
      if (err) return socket.emit('upload error')
      socket.emit('end upload',data.name)
      files={}
      delete files[data.name]


    });


  });
});



/*MYSQL*/
var con = mysql.createConnection({
  host: "localhost",
  user: "harvin",
  password: "harvin"
})

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
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



//view engine
app.set('views', __dirname + '/../app/views');
app.set("view engine", "ejs");
app.use(morgan("common"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(flash());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/../app/public"));
app.use(express.static(__dirname + "./../../HarvinDb"));
app.use(methodOverride("_method"));
app.use(session({
  secret: 'This is a secret phrase, it will be used for hashing the session id',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true
  }
}));
app.use(passport.initialize());
app.use(passport.session());

//Setting local strategy for authentication of user
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// General middleware function

app.use(function(req, res, next) {
  res.locals.currentUser = req.user || null;
  res.locals.msg_error = req.flash("error") || {};
  res.locals.msg_success = req.flash("success") || {};
  next();
});


//index route
app.use("/admin/blog", blogRoutes);

//Error handling middleware function
app.use(function(err, req, res, next) {
  if (err) {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode);
    if ("development" === app.get("env")) {
      res.send({
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

var url = process.env.DATABASEURL ||
  'mongodb://127.0.0.1:27017/harvin';
mongoose.connect(url, {
  useMongoClient: true
});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(err) {
  if (err) {
    console.log(err);
  } else {


    let listener;
    listener = http.listen(process.env.PORT || "3001", function() {
      console.log("Server has started!!! Listening at " + "3001");
      console.log(listener.address().port);

    });
  }

});

//
// server.listen(ser.address().port(), function(){
//   console.log('Express server listening on port ' + router.get('port'));
// });
