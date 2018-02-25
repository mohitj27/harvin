const express = require('express')
const passport = require('passport')
const User = require('../models/User.js')
const Class = require('../models/Class.js')
const Progress = require('../models/Progress.js')
const Profile = require('../models/Profile.js')
const errors = require('../error')
const router = express.Router()
const validator = require('validator')
const _ = require('lodash')
const errorHandler = require('../errorHandler')
const userController = require('../controllers/user.controller')
const batchController = require('../controllers/batch.controller')
const profileController = require('../controllers/profile.controller')
const progressController = require('../controllers/progress.controller')

// TODO: progress of student
// TODO: pluralise populate method
// TODO: await inside await

// Handle user detail update
router.put('/:username', async (req, res, next) => {
  const username = req.body.username || ''
  const batchName = req.body.batch || ''
  const password = req.body.password || ''

  if (!username || validator.isEmpty(username)) return errorHandler.errorResponse('INVALID_FIELD', 'username', next)
  if (!batchName || validator.isEmpty(batchName)) return errorHandler.errorResponse('INVALID_FIELD', 'batch', next)
  if (!password || validator.isEmpty(password)) return errorHandler.errorResponse('INVALID_FIELD', 'password', next)

  try {
    // get chapters in batch
    let foundBatch = await batchController.findBatchByBatchName(batchName)
    foundBatch = await batchController.populateFieldsInBatches(foundBatch, ['subjects'])
    let foundUser = await userController.findUserByUsername(username)
    foundUser = await userController.populateFieldsInUser(foundUser, ['profile'])

    if (!foundUser.profile) return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)

    let progresses = []
    progresses = await progressController.createProgressesForBatch(foundBatch)

    await profileController.updateFieldsInProfileById(foundUser.profile, {}, {
      batch: foundBatch,
      progresses
    })

    return res.json(req.body)
  } catch (err) {
    next(err)
  }
})

// Handle user login -- for student
router.post('/login', passport.authenticate('local'), function (req, res) {
  res.json(req.user)
})

// Handle login with email
router.post('/loginWithEmail', async (req, res, next) => {
  const emailId = req.body.username || ''
  if (!emailId || !validator.isEmail(emailId)) return errorHandler.errorResponse('INVALID_FIELD', 'username', next)
  const index = emailId.indexOf('@')
  const username = emailId.substring(0, index)
  const password = Math.floor(Math.random() * 89999 + 10000) + ''

  var userDetail = {
    username,
    password,
    batch: ''
  }

  // find user
  try {
    var foundUser = await userController.findUserByUsername(username)
  } catch (e) {
    next(e)
  }

  if (foundUser) {
    foundUser = await userController.populateFieldsInUser(foundUser, ['profile.batch'])
    if (!foundUser.profile) return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)
    if (!foundUser.profile.batch) return errorHandler.errorResponse('NOT_FOUND', 'user batch', next)
    if (foundUser.profile && foundUser.profile.batch && foundUser.profile.batch.batchName) {
      userDetail.batch = foundUser.profile.batch.batchName
    }

    return res.json(userDetail)
  } else {
    try {
      const registeredUser = await userController.registerUser({
        username,
        password
      })
      const createdProfile = await profileController.createNewProfile({
        username,
        emailId
      })
      await userController.addProfileToUser(registeredUser, createdProfile)

      res.json(userDetail)
    } catch (e) {
      next(e)
    }
  }
})

// Handle user registration-- for student->Mobile interface
router.post('/signup', async (req, res, next) => {
  res.locals.flashUrl = req.headers.referer

  const username = req.body.username || ''
  const password = req.body.password || ''
  const fullName = req.body.fullName || ''
  const emailId = req.body.emailId || ''
  const phone = req.body.phone || ''
  const batchName = req.body.batch || ''

  if (!username || validator.isEmpty(username)) return errorHandler.errorResponse('INVALID_FIELD', 'username', next)
  if (!password || validator.isEmpty(password)) return errorHandler.errorResponse('INVALID_FIELD', 'password', next)
  if (!fullName || validator.isEmpty(fullName)) return errorHandler.errorResponse('INVALID_FIELD', 'full name', next)
  if (!emailId || validator.isEmpty(emailId)) return errorHandler.errorResponse('INVALID_FIELD', 'email id', next)
  if (!batchName || validator.isEmpty(batchName)) return errorHandler.errorResponse('INVALID_FIELD', 'batch', next)

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
    await userController.updateFieldsInUserById(registerdUser, {}, {
      profile: createdProfile
    })

    req.flash('success', 'Account created successfully')
    return res.redirect(req.headers.referer)
  } catch (err) {
    next(err)
  }
})

// User Register form-- student->from web interface
router.get('/register', async function (req, res, next) {
  try {
    const foundBatches = await batchController.findAllBatch()
    return res.render('studentRegister', {
      foundBatches
    })
  } catch (e) {
    return next(e)
  }
})

router.get('/:username/subjects', async (req, res, next) => {
  const username = req.params.username || ''
  if (!username || validator.isEmpty(username)) return errorHandler.errorResponse('INVALID_FIELD', 'username', next)

  try {
    const foundUser = await userController.findUserByUsername(username)
    if (!foundUser) return errorHandler.errorResponse('NOT_FOUND', 'user', next)
    if (!foundUser.profile) return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)

    let foundBatch = await userController.findBatchOfUserByUsername(username)
    if (!foundBatch) return errorHandler.errorResponse('NOT_FOUND', 'user batch', next)

    foundBatch = await batchController.populateFieldsInBatches(foundBatch, ['subjects.chapters.topics.files'])
    return res.json({
      subjects: foundBatch.subjects
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:username/results', async (req, res, next) => {
  const username = req.params.username || ''
  if (!username || validator.isEmpty(username)) return errorHandler.errorResponse('INVALID_FIELD', 'username', next)

  try {
    let foundUser = await userController.findUserByUsername(username)
    if (!foundUser) return errorHandler.errorResponse('NOT_FOUND', 'user', next)
    if (!foundUser.profile) return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)

    foundUser = await userController.populateFieldsInUser(foundUser, ['profile.results'])

    return res.json({
      results: foundUser.profile.results
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:username/progresses', async (req, res, next) => {
  const username = req.params.username || ''
  if (!username || validator.isEmpty(username)) return errorHandler.errorResponse('INVALID_FIELD', 'username', next)

  try {
    let foundUser = await userController.findUserByUsername(username)
    if (!foundUser) return errorHandler.errorResponse('NOT_FOUND', 'user', next)

    foundUser = await userController.populateFieldsInUser(foundUser, ['profile'])
    if (!foundUser.profile) return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)

    let foundBatch = await userController.findBatchOfUserByUsername(username)
    if (!foundBatch) return errorHandler.errorResponse('NOT_FOUND', 'user batch', next)

    // let progressesToAdd = await batchController.updateProgressOfUserOfBatch(foundUser, foundBatch)
    // let progressesToAdd = []
    let progresses = []
    progresses = await progressController.createProgressesForBatch(foundBatch)

    foundUser = await userController.populateFieldsInUser(foundUser, ['profile.progresses'])

    let usrPro = foundUser.profile.progresses
    const isSameChapter = function (objVal, othVal) {
      if (objVal.chapter.toString() === othVal.chapter.toString()) return true
      else return false
    }

    let progressesToAdd = _.differenceWith(progresses, usrPro, isSameChapter)
    let progressToDelete = _.difference(progresses, progressesToAdd)
    for (let prog of progressToDelete) {
      prog.remove()
    }

    // return progressesToAdd

    let updatedProfile = await profileController.updateFieldsInProfileById(foundUser.profile, {
      progresses: {
        $each: progressesToAdd
      }
    }, {})

    return res.json({
      progresses: updatedProfile.progresses
    })
  } catch (err) {
    next(err)
  }
})

// create /update progress of particular chapter
router.put('/:username/setprogress', (req, res, next) => {
  var username = req.params.username
  var chapterId = req.body.chapter
  var completed = req.body.completed
  var status = req.body.status || 'new'
  var completedTopicsIds = req.body.completedTopicsIds
  let topics = []

  completedTopicsIds.forEach(topicId => {
    if (validator.isMongoId(topicId)) topics.push(topicId)
  })

  User.findOne({
    username: username
  })
    .populate({
      path: 'profile',
      model: 'Profile'
    })
    .exec(function (err, foundUser) {
      if (!err && foundUser) {
        Progress.findOneAndUpdate({
          chapter: chapterId
        }, {
          $set: {
            completed: completed,
            status: status,
            topics: topics
          }
        }, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        },
        function (err, updatedProg) {
          if (!err && updatedProg) {
            Profile.findByIdAndUpdate(
              foundUser.profile, {
                $addToSet: {
                  progresses: updatedProg
                }
              }, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
              },
              function (err, updatedProfile) {
                if (!err && updatedProfile) {
                  res.json({
                    updatedProg: updatedProg
                  })
                } else {
                  next(err)
                }
              }
            )
          } else {
            next(err)
          }
        }
        )
      } else {
        next(err)
      }
    })
})

// sending classes list
router.get('/classes', function (req, res, next) {
  Class.find({}, function (err, classes) {
    if (err) {
      console.log(err)
      next(new errors.notFound())
    }
  })
    .populate({
      path: 'subjects',
      model: 'Subject',
      populate: {
        path: 'chapters',
        model: 'Chapter',
        populate: {
          path: 'topics',
          model: 'Topic',
          populate: {
            path: 'files',
            model: 'File'
          }
        }
      }
    })
    .exec(function (err, classes) {
      if (err) {
        console.log(err)
      } else {
        res.type('application/json')
        res.json({
          classes: classes
        })
      }
    })
})

module.exports = router
