const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const localStrategy = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')
const indexRoutes = require('./routes/index.js')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const config = require('./config')(process.env.NODE_ENV)
const methodOverride = require('method-override')
const compression = require('compression')
const app = express()
const errorHandler = require('./errorHandler')
const mongoose = require('mongoose')
const serveFavicon = require('serve-favicon')
const User = require('./models/User.js')
const http = require('http').Server(app)
const io = require('socket.io')(http)

// setting up body-parser
app.use(bodyParser.urlencoded({
  extended: false
}))

// flash
app.use(flash())

// COMPRESSION
app.use(compression())

// APP favicon
app.use(serveFavicon(path.join(__dirname, 'public', 'images', 'harvin.png')))

// view engine
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.use(morgan('common'))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(flash())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.static(path.join(__dirname, './../../HarvinDb')))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'This is a secret phrase, it will be used for hashing the session id',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true
  }
}))
app.use(passport.initialize())
app.use(passport.session())

// Setting local strategy for authentication of user
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// General middleware function

app.use(function (req, res, next) {
  res.locals.currentUser = req.user || null
  res.locals.msg_error = req.flash('error') || {}
  res.locals.msg_success = req.flash('success') || {}
  next()
})

let files = {}
let struct = {
  name: null,
  type: null,
  size: 0,
  data: [],
  slice: 0
}

io.on('connection', function (socket) {
  socket.on('end upload', () => {
    files = {}
  })
  socket.on('slice upload', (data) => {
    // console.log('hello', data)
    if (!files[data.name]) {
      files[data.name] = Object.assign({}, struct, data)
      files[data.name].data = []
    }
    // convert the ArrayBuffer to Buffer
    data.data = new Buffer(new Uint8Array(data.data))
    // save the data
    fs.writeFile(path.join(__dirname, '/../../HarvinDb/blogImage/') + data.name, data.data, (err) => {
      console.log('err', err)
      // console.log('files data', files[data.name])
      if (err) return socket.emit('upload error')
      socket.emit('end upload', data.name)
      files = {}
      delete files[data.name]
    })
  })
})

// index route
app.use('/', indexRoutes)

// Error handling middleware function
app.use(function (err, req, res, next) {
  if (err) {
    if (err.status !== 401 && err.status !== 403) {
      console.error('err---------------: ', err.stack)
      console.error('err_status: ', err.status)
      console.error('err_msg: ', err.message)
      console.error('err_name: ', err.name)
      console.error('errros: ', err.errors)
      console.log('url', req.originalUrl)
    }
    const status = err.status || 400
    const flashUrl = res.locals.flashUrl
    const errMsg = errorHandler.getErrorMessage(err) || err.message || err
    if (flashUrl) {
      req.flash('error', errMsg)
      res.redirect(flashUrl)
    } else {
      res.status(status).json(errMsg)
    }
  }
})

var url = process.env.DATABASEURL ||
  'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbName
mongoose.connect(url, {
  useMongoClient: true
})

var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function (err) {
  if (err) {
    console.log(err)
  } else {
    http.listen(process.env.PORT || config.port, function () {
      console.log('Server has started!!! Listening at ' + config.port)
    })
  }
})
