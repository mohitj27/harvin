const express = require('express')
const passport = require('passport')
const router = express.Router()
const validator = require('validator')
const _ = require('lodash')
const User = require('../models/User')
const errorHandler = require('../errorHandler')
const userController = require('../controllers/user.controller')
const batchController = require('../controllers/batch.controller')
const profileController = require('../controllers/profile.controller')
const progressController = require('../controllers/progress.controller')
const middleware = require('../middleware')
const jwtConfig = require('../config/jwt')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')


// TODO: pluralise populate method

// Handle user detail update
router.put('/:username', async (req, res, next) => {
  const username = req.body.username || '';
  const batchName = req.body.batch || '';
  const password = req.body.password || '';

  if (!username || validator.isEmpty(username)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'username', next)
  }
  if (!batchName || validator.isEmpty(batchName)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'batch', next)
  }
  if (!password || validator.isEmpty(password)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'password', next)
  }

  try {
    // get chapters in batch
    let foundBatch = await batchController.findBatchByBatchName(batchName)
    foundBatch = await batchController.populateFieldsInBatches(foundBatch, [
      'subjects'
    ])
    let foundUser = await userController.findUserByUsername(username)
    foundUser = await userController.populateFieldsInUsers(foundUser, [
      'profile'
    ])

    if (!foundUser.profile) {
      return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)
    }

    let progresses = []
    progresses = await progressController.createProgressesForBatch(foundBatch)

    await profileController.updateFieldsInProfileById(
      foundUser.profile,
      {},
      {
        batch: foundBatch,
        progresses
      }
    )

    return res.json(req.body)
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

// Handle user login -- for student
router.post('/login', function (req, res) {
  res.redirect('/student/home/')
})

// Handle login with email
router.post('/loginWithEmail', async (req, res, next) => {
  const emailId = req.body.username || '';
  if (!emailId || !validator.isEmail(emailId)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'username', next)
  }
  const index = emailId.indexOf('@')
  const username = emailId.substring(0, index)
  const password = Math.floor(Math.random() * 89999 + 10000) + '';

  var userDetail = {
    username,
    password,
    batch: ''
  }

  // find user
  try {
    var foundUser = await userController.findUserByUsername(username)
  } catch (err) {
    next(err || 'Internal Server Error')
  }

  if (foundUser) {
    foundUser = await userController.populateFieldsInUsers(foundUser, [
      'profile.batch'
    ])
    if (!foundUser.profile) {
      return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)
    }
    if (!foundUser.profile.batch) {
      return errorHandler.errorResponse('NOT_FOUND', 'user batch', next)
    }
    if (
      foundUser.profile &&
      foundUser.profile.batch &&
      foundUser.profile.batch.batchName
    ) {
      userDetail.batch = foundUser.profile.batch.batchName
    }

    return res.json(userDetail)
  } else {
    try {
      const newUser = new User({
        username,
        password
      })
      const registeredUser = await userController.saveUser(newUser)
      const createdProfile = await profileController.createNewProfile({
        username,
        emailId
      })
      await userController.addProfileToUser(registeredUser, createdProfile)

      //
      registeredUser.comparePassword(password, function (err, isMatch) {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          registeredUser = _.pick(registeredUser.toObject(), [
            'username',
            'profile',
            'role',
            '_id'
          ])
          const token = jsonwebtoken.sign(registeredUser, jwtConfig.jwtSecret, {
            expiresIn: '10d' // 1 day
          })
          res.json({
            success: true,
            msg: 'Successfully logged you in as ' + username,
            token: token,
            username
          })
        } else {
          res.json({
            success: false,
            msg: 'Authentication failed. Username or Password did not match.'
          })
        }
      })
      //

      res.json(userDetail)
    } catch (err) {
      next(err || 'Internal Server Error')
    }
  }
})

// Handle user registration-- for student->Mobile interface
router.post('/signup', async (req, res, next) => {
  res.locals.flashUrl = req.headers.referer
  const username = req.body.username || '';
  const password = req.body.password || '';
  const fullName = req.body.fullName || '';
  const emailId = req.body.emailId || '';
  const phone = req.body.phone || '';
  const batchName = req.body.batch || '';

  if (!username || validator.isEmpty(username)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'username', next)
  }
  if (!password || validator.isEmpty(password)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'password', next)
  }
  if (!fullName || validator.isEmpty(fullName)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'full name', next)
  }
  if (!emailId || validator.isEmpty(emailId)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'email id', next)
  }
  if (!batchName || validator.isEmpty(batchName)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'batch', next)
  }

  try {
    const foundBatch = await batchController.findBatchByBatchName(batchName)
    const registerdUser = await userController.registerUser({
      username,
      password
    })
    let progresses = []
    progresses = await progressController.createProgressesForBatch(foundBatch)

    const newProfile = {
      fullName,
      emailId,
      phone,
      batch: foundBatch.id,
      progresses
    }
    const createdProfile = await profileController.createNewProfile(newProfile)
    await userController.updateFieldsInUserById(
      registerdUser,
      {},
      {
        profile: createdProfile
      }
    )

    req.flash('success', 'Account created successfully')
    return res.redirect('/student/login')
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

// User Register form-- student->from web interface
router.get('/register', async function (req, res, next) {
  try {
    const foundBatches = await batchController.findAllBatch()
    return res.render('studentRegister', {
      foundBatches
    })
  } catch (err) {
    return next(err || 'Internal Server Error')
  }
})

router.get('/home/:username', middleware.isLoggedIn, async (req, res, next) => {
  try {
    const user = userController.findUserByUserId(req.user)
  } catch (e) {
  } finally {
  }
  next()
})
router.get('/home', async (req, res, next) => {
  res.render('studentHome')
})

// User Register form-- student->from web interface
router.get('/login', async function (req, res, next) {
  try {
    const foundBatches = await batchController.findAllBatch()
    return res.render('studentLogin')
  } catch (err) {
    return next(err || 'Internal Server Error')
  }
})
// User Register form-- student->from web interface
router.post('/login', async function (req, res, next) {
  try {
    const foundUser = await userController.findOneUser()
    return res.render('studentLogin')
  } catch (err) {
    return next(err || 'Internal Server Error')
  }
})

router.get('/:username/subjects', async (req, res, next) => {
  const username = req.params.username || '';
  if (!username || validator.isEmpty(username)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'username', next)
  }

  try {
    const foundUser = await userController.findUserByUsername(username)
    if (!foundUser) {
      return errorHandler.errorResponse('NOT_FOUND', 'user', next)
    }
    if (!foundUser.profile) {
      return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)
    }

    let foundBatch = await userController.findBatchOfUserByUsername(username)
    if (!foundBatch) {
      return errorHandler.errorResponse('NOT_FOUND', 'user batch', next)
    }

    foundBatch = await batchController.populateFieldsInBatches(foundBatch, [
      'subjects.chapters.topics.files'
    ])
    return res.json({
      subjects: foundBatch.subjects
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get('/:username/results', async (req, res, next) => {
  const username = req.params.username || '';
  if (!username || validator.isEmpty(username)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'username', next)
  }

  try {
    let foundUser = await userController.findUserByUsername(username)
    if (!foundUser) {
      return errorHandler.errorResponse('NOT_FOUND', 'user', next)
    }
    if (!foundUser.profile) {
      return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)
    }

    foundUser = await userController.populateFieldsInUsers(foundUser, [
      'profile.results'
    ])

    return res.json({
      results: foundUser.profile.results
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get('/:username/progresses', async (req, res, next) => {
  const username = req.params.username || '';
  if (!username || validator.isEmpty(username)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'username', next)
  }

  try {
    let foundUser = await userController.findUserByUsername(username)
    if (!foundUser) {
      return errorHandler.errorResponse('NOT_FOUND', 'user', next)
    }

    foundUser = await userController.populateFieldsInUsers(foundUser, [
      'profile'
    ])
    if (!foundUser.profile) {
      return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)
    }

    let foundBatch = await userController.findBatchOfUserByUsername(username)
    if (!foundBatch) {
      return errorHandler.errorResponse('NOT_FOUND', 'user batch', next)
    }

    let progressesToAdd = await progressController.updateProgressOfUserOfBatch(
      foundUser,
      foundBatch
    )

    let updatedProfile = await profileController.updateFieldsInProfileById(
      foundUser.profile,
      {
        progresses: {
          $each: progressesToAdd
        }
      },
      {}
    )

    updatedProfile = await profileController.populateFieldsInProfiles(
      updatedProfile,
      ['progresses']
    )
    return res.json({
      progresses: updatedProfile.progresses
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

// create /update progress of particular chapter
router.put('/:username/setprogress', async (req, res, next) => {
  const username = req.params.username
  const completed = req.body.completed
  const status = req.body.status
  let completedTopicsIds = req.body.completedTopicsIds
  const chapterId = req.body.chapter || '';
  if (!chapterId || validator.isEmpty(chapterId)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'chapter', next)
  }

  let topics = []
  completedTopicsIds = _.castArray(completedTopicsIds)
  completedTopicsIds.forEach(topicId => {
    if (topicId) {
      topicId = topicId.toString()
      if (validator.isMongoId(topicId)) topics.push(topicId)
    }
  })

  try {
    let foundUser = await userController.findUserByUsername(username)
    if (!foundUser) {
      return errorHandler.errorResponse('NOT_FOUND', 'user', next)
    }

    foundUser = await userController.populateFieldsInUser(foundUser, [
      'profile'
    ])
    if (!foundUser.profile) {
      return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)
    }

    let progObj = {
      topics
    }
    if (completed) progObj.completed = completed
    if (status) progObj.status = status
    if (status) progObj.status = status

    let updatedProg = await progressController.updateProgressByChapterId(
      chapterId,
      progObj
    )
    return res.json({
      updatedProg: updatedProg
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})
// CATCH ALL
router.get('/home/:catch', (req, res, next) => {
  res.render('studentHome')
})

module.exports = router
