var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  session = require("express-session"),
  flash = require("connect-flash"),
  indexRoutes = require("./routes/index.js"),
  morgan = require("morgan"),
  fs = require('fs'),
  path = require("path"),
  dotenv = require('dotenv').config(),
  config = require('./config')(process.env.NODE_ENV),
  methodOverride = require("method-override"),
  compression = require('compression'),
  app = express(),
  mongoose = require("mongoose"),
  mysql = require('mysql'),

  serveFavicon = require('serve-favicon'),

  Schema = mongoose.Schema,

  User = require("./models/User.js"),
  http = require('http').Server(app),
  io = require('socket.io')(http)

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

  console.log('a user conn sadaected');

  socket.on('end upload', () => {
    files = {}
  })
  socket.on('slice upload', (data) => {

    console.log('hello', data)
    if (!files[data.name]) {
      files[data.name] = Object.assign({}, struct, data)
      files[data.name].data = []
    }

    //convert the ArrayBuffer to Buffer
    data.data = new Buffer(new Uint8Array(data.data))
    //save the data


    fs.writeFile(__dirname + "/../../HarvinDb/blogImage/" + data.name, data.data, (err) => {
      console.log('err', err)
      console.log('files data', files[data.name])
      console.log('twice problem')
      if (err) return socket.emit('upload error')
      socket.emit('end upload', data.name)
      files = {}
      delete files[data.name]


    });


  });
});


io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
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
app.use(serveFavicon(path.join(__dirname, 'public', 'images', 'harvin.png')))


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
app.use("/", indexRoutes);

// Error handling middleware function
app.use(function(err, req, res, next) {
  if (err) {

    console.error("err---------------: ", err.stack);
    console.error("err_status: ", err.status);
    console.error("err_msg: ", err.message);
    console.error("err_name: ", err.name);
    console.log('url', req.originalUrl);
    const status = err.status || 400;
    const flashUrl = res.locals.flashUrl
    const errMsg = err.message || err
    // res.status(status).json(err);
    if (flashUrl) {
      req.flash('error', errMsg)
      res.redirect(flashUrl)
    } else {
      res.status(status).json(errMsg)
    }
  }
});

var url = process.env.DATABASEURL ||
  'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbName;
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
    listener = http.listen(process.env.PORT || config.port, function() {
      console.log("Server has started!!! Listening at " + config.port);
    });
  }

});
