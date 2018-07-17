const express = require('express')
const passport = require('passport')
const userController = require('../controllers/user.controller')
const profileController = require('../controllers/profile.controller')
const instituteController = require('../controllers/institute.controller')
const errorHandler = require('../errorHandler')
const jsonwebtoken = require('jsonwebtoken')
const _ = require('lodash')
const validator = require('validator')
const jwtConfig = require('../config/jwt')
const jwt = require('express-jwt')
const User = require('../models/User')
const middleware = require('../middleware')
// const passportConfig = require('../config/passport')(passport)

let router = express.Router()

// User registration form-- for admin
router.get('/signup', function (req, res) {
  res.render('signup')
})

// ADMIN HOME
router.get(
  '/',
  jwt({
    secret: jwtConfig.jwtSecret,
    getToken: jwtConfig.getToken
  }),
  function (req, res) {
    res.render('home', {
      msg_success: 'Welcome back!'
    })
  }
)

// Student signup -JWT
router.post('/signup', async (req, res, next) => {
  res.locals.flashUrl = '/admin/signup'
  console.log('body', req.body)

  const username = req.body.username || ''
  const password = req.body.password || ''
  const role = req.body.role
  const instituteName = req.body.instituteName || ''
  const centerName = req.body.centerName || ''

  if (!instituteName || validator.isEmpty(instituteName)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'Institute name', next)
  }
  if (!centerName || validator.isEmpty(centerName)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'Center name', next)
  }
  if (!username || validator.isEmpty(username)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'center name', next)
  }
  if (!password || validator.isEmpty(password)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'password', next)
  }
  if (!role || role.length <= 0) {
    return errorHandler.errorResponse('INVALID_FIELD', 'role', next)
  }

  let newUser = new User({
    username,
    password,
    role
  })
  try {
    let createdUser = await userController.saveUser(newUser)
    if (!createdUser) {
      return errorHandler.errorResponse(
        errorHandler.ERROR_TYPES.INTERNAL_SERVER_ERROR,
        null,
        next
      )
    }

    let createdInstitute

    createdInstitute = await instituteController.findInstituteByName(
      instituteName
    )
    if (!createdInstitute) {
      createdInstitute = await instituteController.createInstitute({
        instituteName
      })
    }

    let updatedInstitute = await instituteController.updateFieldsInInstituteById(
      createdInstitute, {
        centers: createdUser
      }
    )

    let createdProfile = await profileController.createNewProfile({
      fullName: centerName,
      isCenterOfInstitute: updatedInstitute
    })

    if (!createdProfile) {
      return errorHandler.errorResponse(
        errorHandler.ERROR_TYPES.INTERNAL_SERVER_ERROR,
        null,
        next
      )
    }
    await userController.updateFieldsInUserById(
      newUser, {}, {
        profile: createdProfile
      }
    )
    //
    req.flash('success', 'Signup Succesful! Please Login to Continue')
    res.redirect('/admin/login')
  } catch (err) {
    let errMsg = errorHandler.getErrorMessage(err)
    if (errMsg.includes('duplicate')) {
      return next(new Error('This username is already taken.'))
    } else return next(err || 'Internal Server Error')
  }
})

// Student login form-- admin
router.get('/login', function (req, res) {
  res.render('login', {
    error: res.locals.msg_error[0]
  })
})


// Handle user login -- for admin
// router.post(
//   '/login',
//   passport.authenticate('local', {
//     failureRedirect: '/admin/login',
//     successFlash: 'Welcome back',
//     failureFlash: true
//   }),
//   function (req, res) {
//     res.redirect(req.session.returnTo || '/admin')
//     delete req.session.returnTo
//   }
// )

// Handle user login JWT
router.post('/login', function (req, res, next) {
  let username = req.body.username
  let password = req.body.password
  if (!username || !password) {
    return res.json({
      success: false,
      msg: 'Please enter username and password.'
    })
  } else {
    User.findOne({
      username: username
    },
      function (err, user) {
        if (err) next(err || 'Internal Server Error')

        if (!user) {
          res.json({
            success: false,
            msg: 'Authentication failed. User not found.'
          })
        } else {
          // Check if password matches
          user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              // Create token if the password matched and no error was thrown
              user = _.pick(user.toObject(), [
                'username',
                'profile',
                'role',
                '_id'
              ])
              const token = jsonwebtoken.sign(user, jwtConfig.jwtSecret, {
                expiresIn: '7d' // 1 day
              })
              res.json({
                success: true,
                msg: 'Successfully logged you in as ' + username,
                token: token,
                user
              })
            } else {
              res.json({
                success: false,
                msg: 'Authentication failed. Username or Password did not match.'
              })
            }
          })
        }
      }
    )
  }
})

// User logout-- admin
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/admin')
})

router.get(
  '/test',
  jwt({
    secret: jwtConfig.jwtSecret
  }),

  (req, res) => {
    // console.log('logged in user', req.user)
    res.redirect('/admin/login')
  }
)

module.exports = router