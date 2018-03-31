const errorHandler = require('../errorHandler')
const User = require('./../models/User')
const _ = require('lodash')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise
const bcrypt = require('bcrypt')
const jwtConfig = require('../config/jwt')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')

const findUserByUsername = function (username) {
  return new Promise(function (resolve, reject) {
    User.findOne(
      {
        username
      },
      function (err, foundUser) {
        if (err) return reject(errorHandler.getErrorMessage(err))
        else return resolve(foundUser)
      }
    )
  })
}

const findUserByUserId = function (userId) {
  return new Promise(function (resolve, reject) {
    User.findById(userId)
      .then(foundUser => resolve(foundUser))
      .catch(err => reject(err))
  })
}

const findAllUsers = function () {
  return new Promise(function (resolve, reject) {
    User.findAsync()
      .then(foundUsers => resolve(foundUsers))
      .catch(err => reject(err))
  })
}

const findAllCenters = function () {
  return new Promise(function (resolve, reject) {
    User.findAsync({
      role: 'centre'
    })
      .then(foundUsers => resolve(foundUsers))
      .catch(err => reject(err))
  })
}

const populateFieldsInUsers = function (users, path) {
  return new Promise(function (resolve, reject) {
    User.deepPopulate(users, path)
      .then(populatedUsers => resolve(populatedUsers))
      .catch(err => reject(err))
  })
}
//Passport
const registerUser = function (newUser) {
  return new Promise(function (resolve, reject) {
    User.register(
      new User({
        username: newUser.username,
        role: newUser.role
      }),
      newUser.password,
      function (err, registeredUser) {
        if (err) return reject(errorHandler.getErrorMessage(err))
        else return resolve(registeredUser)
      }
    )
  })
}
//JWT
const saveUser = async function (newUser) {
  return new Promise(function (resolve, reject) {
    newUser.save((err, createdUser) => {
      if (err) return reject(err)
      else resolve(createdUser)
    })
  })
}

const updatePassword = function (user, newPassword) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return reject(err)
      }
      bcrypt.hash(newPassword, salt, function (err, hash) {
        if (err) {
          return reject(err)
        }
        // user.password = hash
        User.findByIdAndUpdate(user._id, { $set: {password: hash} }, { upsert: true, new: true }, function (
          err,
          updatedUser
        ) {
          if (err) return reject(err)
          else return resolve(updatedUser)
        })
      })
    })
  })
}

const generateToken = function (user, password) {

  return new Promise(function (resolve, reject) {
    user.comparePassword(password, function (err, isMatch) {
      if (isMatch && !err) {
        // Create token if the password matched and no error was thrown
        user = _.pick(user.toObject(), ['username', 'profile', 'role', '_id'])
        const token = jsonwebtoken.sign(user, jwtConfig.jwtSecret, {
          expiresIn: '1000d' // 10 day
        })

        resolve(token)
      } else {

        reject('Authentication failed. Username or Password did not .')
      }
    })
  })
}

const instituteOfCurrentCenter = async function (center, next) {
  let currentCenter = await populateFieldsInUsers(center, [
    'profile.isCenterOfInstitute'
  ])
  let currentCenterProfile = currentCenter.profile
  if (!currentCenterProfile) {
    return errorHandler.errorResponse('NOT_FOUND', 'center profile', next)
  }
  let curretnCenterInstitute = currentCenterProfile.isCenterOfInstitute
  if (!curretnCenterInstitute) {
    return errorHandler.errorResponse('NOT_FOUND', 'center institute', next)
  }
  return curretnCenterInstitute
}

const centersOfInstituteOfCenter = async function (center, next) {
  let currentCenter = await populateFieldsInUsers(center, [
    'profile.isCenterOfInstitute.centers.profile'
  ])
  let currentCenterProfile = currentCenter.profile
  if (!currentCenterProfile) {
    return errorHandler.errorResponse('NOT_FOUND', 'center profile', next)
  }
  let curretnCenterInstitute = currentCenterProfile.isCenterOfInstitute
  if (!curretnCenterInstitute) {
    return errorHandler.errorResponse('NOT_FOUND', 'center institute', next)
  }
  return curretnCenterInstitute.centers
}

const addProfileToUser = function (user, profile) {
  return new Promise(function (resolve, reject) {
    User.findOneAndUpdate(
      {
        _id: user._id
      },
      {
        $set: {
          profile: profile
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      },
      function (err, updatedUser) {
        if (err) return reject(errorHandler.getErrorMessage(err))
        else return resolve(updatedUser)
      }
    )
  })
}

const findBatchOfUserByUsername = async function (username, next) {
  // TODO: why profile is populated not user
  let foundUser = await findUserByUsername(username)
  if (!foundUser) return errorHandler.errorResponse('NOT_FOUND', 'user', next)

  try {
    foundUser = await populateFieldsInUsers(foundUser, ['profile.batch'])
  } catch (err) {
    next(err || 'Internal Server Error')
  }

  if (!foundUser.profile) {
    return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)
  }

  return foundUser.profile.batch
}

const updateFieldsInUserById = function (user, addToSetFields, setFields) {
  if (_.isEmpty(addToSetFields)) {
    return new Promise(function (resolve, reject) {
      User.findByIdAndUpdateAsync(
        user.id,
        {
          $set: setFields
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      )
        .then(updatedProfile => resolve(updatedProfile))
        .catch(err => reject(err))
    })
  } else if (_.isEmpty(setFields)) {
    return new Promise(function (resolve, reject) {
      User.findByIdAndUpdateAsync(
        user.id,
        {
          $addToSet: addToSetFields
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      )
        .then(updatedProfile => resolve(updatedProfile))
        .catch(err => reject(err))
    })
  } else {
    return new Promise(function (resolve, reject) {
      User.findByIdAndUpdateAsync(
        user.id,
        {
          $set: setFields,
          $addToSet: addToSetFields
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      )
        .then(updatedProfile => resolve(updatedProfile))
        .catch(err => reject(err))
    })
  }
}

module.exports = {
  findUserByUsername,
  registerUser,
  saveUser,
  addProfileToUser,
  findBatchOfUserByUsername,
  findAllUsers,
  populateFieldsInUsers,
  findUserByUserId,
  updateFieldsInUserById,
  findAllCenters,
  instituteOfCurrentCenter,
  centersOfInstituteOfCenter,
  updatePassword,
  generateToken
}
