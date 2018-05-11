const express = require('express')
const bodyParser = require('body-parser')
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
const cors = require('cors')
const serveFavicon = require('serve-favicon')
const sleep = require('sleep');
const User = require('./models/User.js')
const userController = require('./controllers/user.controller')
const instituteController = require('./controllers/institute.controller')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const env = require('dotenv').config()
const LOG_DIR = 'logFile.txt'
let errorsRep = null
if (process.env.CRASH_REPORT_API_KEY_PATH) {
  // Imports the Google Cloud client library
  const ErrorReporting = require('@google-cloud/error-reporting')
  errorsRep = ErrorReporting({
    projectId: 'harvin-151295',
    keyFilename: process.env.CRASH_REPORT_API_KEY_PATH
  })
}

app.use(cors())
// errors.report('Something broke!');
// setting up body-parser
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

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
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(flash())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.static(path.join(__dirname, './../../HarvinDb')))
console.log('path', path.join(__dirname, '../client/harvinreact/build'))

app.use(express.static(path.join(__dirname, '../client/harvinreact/build')))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: 'This is a secret phrase, it will be used for hashing the session id',
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: true
    }
  })
)
app.use(
  fileUpload({
    limits: {
      fileSize: 50 * 1024 * 1024
    },
    safeFileNames: true,
    preserveExtension: 4,
    abortOnLimit: true
  })
)

app.use(function (req, res, next) {
  // sleep.sleep(1)
  if (req.method === 'POST' || req.method === 'PUT') {
    const data = req.body

    fs.stat('msg.txt', (err, stats) => {
      if (err) return console.log('err stats', err)
      else {
        if (stats.size > 10000000) {
          fs.unlink('msg.txt', err => {
            if (err) console.log('err remove file', err)
            else {
              fs.appendFile('msg.txt', JSON.stringify(data) + '\n', err => {
                if (err) throw err
              })
            }
          })
        } else {
          fs.appendFile('msg.txt', JSON.stringify(data) + '\n', err => {
            if (err) throw err
          })
        }
      }
    })
  }
  next()
})

// General middleware function

app.use(async function (req, res, next) {
  try {
    // res.locals.centers = await userController.findAllCenters()
    let allCenters = await userController.findAllCenters()
    allCenters = await userController.populateFieldsInUsers(allCenters, [
      'profile'
    ])

    res.locals.currentUser = req.user || null
    if (req.user) {
      let user = await userController.populateFieldsInUsers(req.user, [
        'profile'
      ])
      res.locals.centerProfile = user.profile || null
      if (user.profile) {
        res.locals.institute = await instituteController.findInstituteById(
          user.profile.isCenterOfInstitute
        )
        allCenters = _.filter(allCenters, function (center) {
          if (center.profile) {
            if (
              center.profile.isCenterOfInstitute.toString() ===
              user.profile.isCenterOfInstitute.toString()
            ) {
              return center
            }
          }
        })

        res.locals.centers = allCenters
      }

      if (!res.locals.institute) {
        return errorHandler.errorResponse('NOT_FOUND', 'auth institute', next)
      }

      if (!res.locals.centers) {
        return errorHandler.errorResponse('NOT_FOUND', 'auth centers', next)
      }
    }

    res.locals.centers = res.locals.centers || []
    res.locals.institute = res.locals.institute || {}
    res.locals.msg_error = req.flash('error') || {}
    res.locals.msg_success = req.flash('success') || {}
    next()
  } catch (err) {
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
  socket.on('slice upload', data => {
    // console.log('hello', data)
    if (!files[data.name]) {
      files[data.name] = Object.assign({}, struct, data)
      files[data.name].data = []
    }

    // convert the ArrayBuffer to Buffer
    data.data = new Buffer(new Uint8Array(data.data))

    // save the data
    fs.writeFile(
      path.join(__dirname, '/../../HarvinDb/blogImage/') + data.name,
      data.data,
      err => {
        console.log('err', err)

        // console.log('files data', files[data.name])
        if (err) return socket.emit('upload error')
        socket.emit('end upload', data.name)
        files = {}
        delete files[data.name]
      }
    )
  })
})

// index route
app.use('/', indexRoutes)

// Error handling middleware function
app.use(function (err, req, res, next) {
  if (err) {
    // error reporting
    if (
      err.status !== 401 &&
      err.status !== 403 &&
      err.code !== 'credentials_required' &&
      err.code !== 'credentials_bad_format' &&
      err.code !== 'credentials_bad_scheme' &&
      err.code !== 'invalid_token' &&
      err.toReport &&
      errorsRep
    ) {
      console.log('##########reported###########')
      errorsRep.report(err)
    }

    if (err.status !== 401 && err.status !== 403) {
      console.error('err---------------: ', err.stack)
      console.error('err_status: ', err.status)
      console.error('err_name: ', err.name)
      console.error('err_toShowNotFound: ', err.toShowNotFound)
      console.error('err_toReport: ', err.toReport)
      console.error('errros: ', err.errors)
    }

    console.error('err_code: ', err.code)
    console.error('err_msg: ', err.message)
    console.error('url', req.originalUrl)
    const status = err.status || 400
    const flashUrl = res.locals.flashUrl
    const errMsg = errorHandler.getErrorMessage(err) || err.message || err

    // POSIIBLE PROBLEM HERE admin/route comes here in case of BAD TOKEN
    if (
      err.code === 'credentials_required' ||
      err.code === 'credentials_bad_format' ||
      err.code === 'credentials_bad_scheme' ||
      err.code === 'invalid_token' ||
      err.name.indexOf('AUTH') > -1
    ) {
      req.flash('error', 'Please Login')
      return res.redirect('/admin/login')
    }

    if (flashUrl) {
      if (err.toShowNotFound) {
        return res.render('notFound')
      }

      req.flash('error', errMsg)
      res.redirect(flashUrl)
    } else {
      if (err.toShowNotFound) {
        return res
          .status(404)
          .json({
            success: false,
            msg: 'Sorry, the item you are looking for is NOT FOUND!!!'
          })
      }

      res.status(status).json(errMsg)
    }
  }
})

// app.use(errors.express)

var url =
  process.env.DATABASEURL ||
  'mongodb://' +
  config.mongo.host +
  ':' +
  config.mongo.port +
  '/' +
  config.mongo.dbName
mongoose.connect(url, {
  useMongoClient: true
})

var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function (err) {
  if (err) {
    console.log(err)
  } else {
    let port = process.env.PORT || config.port
    http.listen(port, function () {
      console.log('Server has started!!! Listening at ' + port)
    })
  }
})