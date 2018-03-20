const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
// const localStrategy = require('passport-local')
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
const fileUpload = require('express-fileupload')
const _ = require('lodash')
const serveFavicon = require('serve-favicon')
const User = require('./models/User.js')
const userController = require('./controllers/user.controller')
const instituteController = require('./controllers/institute.controller')
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
// app.use(passport.initialize())
// app.use(passport.session())

// Setting local strategy for authentication of user
// passport.use(new localStrategy(User.authenticate()))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  safeFileNames: true,
  preserveExtension: true,
  abortOnLimit: true
}))

// General middleware function

app.use(async function (req, res, next) {
  console.log('middle ware' , res.locals)

  try {
    // res.locals.centers = await userController.findAllCenters()
    let allCenters = await userController.findAllCenters()
    allCenters = await userController.populateFieldsInUsers(allCenters, ['profile'])

    res.locals.currentUser = req.user || null
    if (req.user) {
      let user = await userController.populateFieldsInUsers(req.user, ['profile'])
      res.locals.centerProfile = user.profile || null
      if (user.profile) {
        res.locals.institute = await instituteController.findInstituteById(user.profile.isCenterOfInstitute)
        allCenters = _.filter(allCenters, function (center) {
          if (center.profile) {
            if (center.profile.isCenterOfInstitute.toString() == user.profile.isCenterOfInstitute.toString()) {
              return center
            }
          }
        })
        res.locals.centers = allCenters
      }

      if (!res.locals.institute) return errorHandler.errorResponse('NOT_FOUND', 'institute', next)
      if (!res.locals.centers) return errorHandler.errorResponse('NOT_FOUND', 'centers', next)
    }
    res.locals.centers = res.locals.centers || []
    res.locals.institute = res.locals.institute || {}
    res.locals.msg_error = req.flash('error') || {}
    res.locals.msg_success = req.flash('success') || {}
    console.log('local' , res.locals)
    next()
  } catch (err) {
    console.log('errrrrr')

    next(err || 'Internal Server Error')
  }
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
      console.error('err_name: ', err.name)
      console.error('errros: ', err.errors)
    }
    console.error('err_code: ', err.code)
    console.error('err_msg: ', err.message)
    console.log('url', req.originalUrl)
    const status = err.status || 400
    const flashUrl = res.locals.flashUrl
    const errMsg = errorHandler.getErrorMessage(err) || err.message || err
    //POSIIBLE PROBLEM HERE admin/route comes here in case of BAD TOKEN
    if(err.code==="credentials_required"||err.code==='credentials_bad_format'||err.code==='credentials_bad_scheme'||err.code==='invalid_token'){
      req.flash('error', 'Please Login')
      console.log('status sent')
        return res.redirect('/admin/login')
    }

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
