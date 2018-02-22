const express = require('express')
const passport = require('passport')
const Async = require('async')
const User = require('../models/User.js')
const Class = require('../models/Class.js')
const Subject = require('../models/Subject')
const Batch = require('../models/Batch.js')
const Progress = require('../models/Progress.js')
const Profile = require('../models/Profile.js')
const errors = require('../error')
const _ = require('lodash')
const router = express.Router()
const validator = require('validator')
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

  let progresses = []

  try {
    // get chapters in batch
    let foundBatch = await batchController.findBatchByBatchName(batchName)
    foundBatch = await batchController.populateFieldsInBatches(foundBatch, ['subjects'])
    let foundUser = await userController.findUserByUsername(username)
    // foundUser = await userController.populateFieldsInUser(foundUser, ['profile'])
    let subjects = foundBatch.subjects
    let chapterIds = []
    _.forEach(subjects, subject => {
      chapterIds = _.concat(chapterIds, subject.chapters)
    })
    let progresses = []

    for (let chapter of chapterIds) {
      let createdProgress = await progressController.createProgress({
        chapter
      })
      progresses = _.concat(progresses, createdProgress)
    }
    // progresses = await progressController.createProgressesOfChapterIds(chapterIds)
    console.log('progresses', progresses)

    if (!foundUser.profile) return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)

    let updatedProfile = await profileController.updateFieldsInProfileById(foundUser.profile, {}, {
      batch: foundBatch,
      progresses
    })
    console.log('updaeprof', updatedProfile)
    return res.sendStatus(200)
  } catch (err) {
    next(err)
  }

  Batch.findOne({
    batchName: batchName
  }, (err, foundBatch) => {
    if (!err && foundBatch) {
      User.findOne({
        username: username
      })
        .populate({
          path: 'profile',
          model: 'Profile'
        })
        .exec((err, foundUser) => {
          if (!err && foundUser) {
            let subjectId = foundBatch.subjects
            Subject.find({
              _id: {
                $in: subjectId
              }
            }, function (err, foundSubjects) {
              if (!err && foundSubjects) {
                var counter = 0
                let chaptersArr = []
                foundSubjects.forEach((subject, subjectIndex) => {
                  var chapters = subject.chapters
                  counter += chapters.length
                  chapters.forEach((chapter, chapterIndex) => {
                    chaptersArr.push(chapter)
                  })
                })
                Async.each(chaptersArr, function (chapter, callback) {
                  var newProg = {
                    chapter: chapter
                  }

                  Progress.create(newProg, (err, createdProgress) => {
                    if (!err && createdProgress) {
                      progresses.push(createdProgress)
                      callback()
                    } else {
                      console.log('err', err)
                      callback(err)
                    }
                  })
                },
                function (err) {
                  if (err) {
                    next(errorHandler.getErrorMessage(err))
                  } else {
                    Profile.findByIdAndUpdate(
                      foundUser.profile._id, {
                        $set: {
                          batch: foundBatch._id,
                          progresses: progresses
                        }
                      }, {
                        upsert: false,
                        new: true
                      },
                      (err, updatedProfile) => {
                        console.log('updated profile', updatedProfile)
                        if (!err && updatedProfile) {
                          var userDetail = {
                            username,
                            password,
                            batch: batchName
                          }

                          res.json(userDetail)
                        } else {
                          console.log(err)
                          next(errorHandler.getErrorMessage(err))
                        }
                      }
                    )
                  }
                })
              } else {
                next(errorHandler.getErrorMessage(err))
              }
            })
          } else {
            next(errorHandler.getErrorMessage(err))
          }
        })
    }
  })
})

// Handle user login -- for student
router.post('/login', passport.authenticate('local'), function (req, res) {
  res.json(req.user)
})

// Handle login with email
router.post('/loginWithEmail', async (req, res, next) => {
  var emailId = req.body.username || ''
  if (!emailId || !validator.isEmail(emailId)) return errorHandler.errorResponse('INVALID_FIELD', 'username', next)
  var index = emailId.indexOf('@')
  var username = emailId.substring(0, index)
  var password = Math.floor(Math.random() * 89999 + 10000) + ''

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
    // populate profile and batch
    foundUser.populate({
      path: 'profile',
      polulate: {
        path: 'batch'
      }
    }, function (err, foundUser) {
      if (err) return next(errorHandler.getErrorMessage(err))

      else if (foundUser.profile && foundUser.profile.batch && foundUser.profile.batch.batchName) {
        userDetail.batch = foundUser.profile.batch.batchName
      }

      res.json(userDetail)
    })
  } else {
    try {
      var registeredUser = await userController.registerUser({
        username,
        password
      })
      var createdProfile = await profileController.createNewProfile({
        username,
        emailId
      })
      var updatedProfile = await userController.addProfileToUser(registeredUser, createdProfile)

      res.json(userDetail)
    } catch (e) {
      next(e)
    }
  }
})

// Handle user registration-- for student->Mobile interface
router.post('/signup', function (req, res) {
  var username = req.body.username
  var password = req.body.password
  var fullName = req.body.fullName
  var emailId = req.body.emailId
  var phone = req.body.phone
  var batchName = req.body.batch || ''

  // for the student who are enrolled in any batch
  if (batchName && batchName.length > 0) {
    // find batch
    Async.waterfall(
      [
        function (callback) {
          Batch.findOne({
            batchName: batchName
          },
          function (err, foundBatch) {
            if (!err && foundBatch) {
              callback(null, foundBatch)
            } else {
              callback(err)
            }
          }
          )
        },
        function (callback) {
          User.register(
            new User({
              username: username
            }),
            password,
            function (err, user) {
              if (err) {
                console.log(err)
                req.flash('error', err.message)
                return res.redirect('/student/signup')
              } else if (user && !err) {
                callback(null, user)
              }
            }
          )
        },
        function (user, callback) {
          var newProfile = {
            fullName,
            emailId,
            phone,
            batch: foundBatch._id
          }

          // if registered successfully create profile
          Profile.create(newProfile, function (err, createdProfile) {
            if (!err && createdProfile) {
              callback(null, user, createdProfile)
            } else {
              callback(err)
            }
          })
        },
        function (user, createdProfile, callback) {
          User.findOneAndUpdate({
            _id: user._id
          }, {
            $set: {
              profile: createdProfile
            }
          }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          },
          function (err, updatedUser) {
            if (!err && updatedUser) {
              callback(null, createdProfile, updatedUser)
            } else {
              callback(err)
            }
          }
          )
        },
        function (createdProfile, updatedUser, callback) {
          passport.authenticate('local')(req, res, function () {
            User.findOne({
              _id: updatedUser._id
            })
              .populate({
                path: 'profile',
                model: 'Profile',
                populate: {
                  path: 'batch',
                  model: 'Batch'
                }
              })
              .exec(function (err, foundUser) {
                if (!err && foundUser) {
                  res.json(foundUser)
                } else {
                  console.log(err)
                }
              })
          })
        }
      ],
      function (err, result) {
        if (err) {
          console.log(err)
          next(new errors.generic())
        } else {}
      }
    )
  }
})

// User Register form-- student->from web interface
router.get('/register', async function (req, res) {
  try {
    var foundBatches = await batchController.findAllBatch()
  } catch (e) {
    return next(e)
  }
  res.render('studentRegister', {
    foundBatches
  })
})

// Handle User Register form-- student->from web interface
router.post('/register', async function (req, res, next) {
  res.locals.flashUrl = req.originalUrl

  var username = req.body.username || ''
  var password = req.body.password || ''
  var fullName = req.body.fullName || ''
  var emailId = req.body.emailId || ''
  var phone = req.body.phone || ''
  var batchName = req.body.batch || ''

  if (!username || validator.isEmpty(username)) return errorHandler.errorResponse('INVALID_FIELD', 'username', next)
  if (!password || validator.isEmpty(password)) return errorHandler.errorResponse('INVALID_FIELD', 'password', next)
  if (!batchName || validator.isEmpty(batchName)) return errorHandler.errorResponse('INVALID_FIELD', 'batch name', next)

  try {
    var registerdUser = await userController.registerUser({
      username,
      password
    })
    var createdProfile = await profileController.createNewProfile({
      fullName,
      emailId,
      phone
    })
    var foundBatch = await batchController.findBatchByBatchName(batchName)
    var updatedProfile = await profileController.addBatchToProfile(foundBatch, createdProfile)
    var updatedUser = await userController.addProfileToUser(registerdUser, createdProfile)

    passport.authenticate('local')(req, res, function () {
      req.flash('success', 'Successfully signed you in')
      res.redirect('/admin')
    })
  } catch (e) {
    next(e)
  }
})

router.get('/:username/subjects', function (req, res) {
  var subjects = {}
  User.findOne({
    username: req.params.username
  },
  function (err, foundUser) {
    if (!err && foundUser) {} else if (err) {
      console.log(err)
    }
  }
  )
    .populate({
      path: 'profile',
      model: 'Profile',
      populate: {
        path: 'batch',
        model: 'Batch',
        populate: {
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
        }
      }
    })
    .exec(function (err, userDetail) {
      if (!err && userDetail) {
        subjects = userDetail.profile.batch.subjects
        res.json({
          subjects: subjects
        })
      } else {}
    })
})

router.get('/:username/results', function (req, res, next) {
  let username = req.params.username
  User.findOne({
    username: username
  })
    .populate({
      path: 'profile',
      model: 'Profile',
      populate: {
        path: 'results',
        model: 'Result'
      }
    })
    .exec((err, foundUser) => {
      if (!err && foundUser) {
        res.json({
          results: foundUser.profile.results
        })
      }
    })
})

router.get('/:username/progresses', (req, res, next) => {
  User.findOne({
    username: req.params.username
  },
  function (err, foundUser) {
    if (!err && foundUser) {} else if (err) {
      console.log(err)
    }
  }
  )
    .populate({
      path: 'profile',
      model: 'Profile',
      populate: {
        path: 'progresses',
        model: 'Progress'
      }
    })
    .exec(function (err, foundUser) {
      if (!err && foundUser) {
        progresses = foundUser.profile.progresses
        res.json({
          progresses: progresses
        })
      }
    })
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
