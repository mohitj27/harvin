const errorHandler = require('../errorHandler')
const User = require('./../models/User')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const findUserByUsername = function (username) {
  return new Promise(function (resolve, reject) {
    User.findOne({
      username
    }, function (err, foundUser) {
      if (err) return reject(errorHandler.getErrorMessage(err))
      else return resolve(foundUser)
    })
  })
}

const findAllUsers = function () {
  return new Promise(function (resolve, reject) {
    User
      .findAsync()
      .then(foundUsers => resolve(foundUsers))
      .catch(err => reject(err))
  })
}

const populateFieldInUser = function (user, field) {
  return new Promise(function (resolve, reject) {
    User
      .populate(user, field)
      .then(populatedUser => resolve(populatedUser))
      .catch(err => reject(err))
  })
}

const populateFieldsInUser = function (user, path) {
  return new Promise(function (resolve, reject) {
    User
      .deepPopulate(user, path)
      .then(populatedUser => resolve(populatedUser))
      .catch(err => reject(err))
  })
}

const registerUser = function (newUser) {
  return new Promise(function (resolve, reject) {
    User.register(
      new User({
        username: newUser.username,
        role: newUser.role
      }), newUser.password,
      function (err, registeredUser) {
        if (err) return reject(errorHandler.getErrorMessage(err))
        else return resolve(registeredUser)
      }
    )
  })
}

const addProfileToUser = function (user, profile) {
  return new Promise(function (resolve, reject) {
    User.findOneAndUpdate({
      _id: user._id
    }, {
      $set: {
        profile: profile
      }
    }, {
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
    foundUser = await populateFieldsInUser(foundUser, ['profile.batch'])
    console.log('founduser', foundUser)
  } catch (err) {
    next(err)
  }

  if (!foundUser.profile) {
    return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)
  }

  return foundUser.profile.batch
}

module.exports = {
  findUserByUsername,
  registerUser,
  addProfileToUser,
  populateFieldInUser,
  findBatchOfUserByUsername,
  findAllUsers,
  populateFieldsInUser
}
