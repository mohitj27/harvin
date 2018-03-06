const errorHandler = require('../errorHandler')
const User = require('./../models/User')
const _ = require('lodash')
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

const findUserByUserId = function (userId) {
  return new Promise(function (resolve, reject) {
    User
      .findById(userId)
      .then(foundUser => resolve(foundUser))
      .catch(err => reject(err))
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

const findAllCenters = function () {
  return new Promise(function (resolve, reject) {
    User
      .findAsync({role: 'centre'})
      .then(foundUsers => resolve(foundUsers))
      .catch(err => reject(err))
  })
}

const populateFieldsInUsers = function (users, path) {
  return new Promise(function (resolve, reject) {
    User
      .deepPopulate(users, path)
      .then(populatedUsers => resolve(populatedUsers))
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

const saveUser = function (newUser) {
  return new Promise(function (resolve, reject) {
    newUser.save((err, createdUser) => {
      if (err) return reject(err)
      else resolve(createdUser)
    })
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
    foundUser = await populateFieldsInUsers(foundUser, ['profile.batch'])
  } catch (err) {
    next(err)
  }

  if (!foundUser.profile) {
    return errorHandler.errorResponse('NOT_FOUND', 'user profile', next)
  }

  return foundUser.profile.batch
}

const updateFieldsInUserById = function (user, addToSetFields, setFields) {
  if (_.isEmpty(addToSetFields)) {
    return new Promise(function (resolve, reject) {
      User.findByIdAndUpdateAsync(user.id, {
        $set: setFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedProfile => resolve(updatedProfile))
        .catch(err => reject(err))
    })
  } else if (_.isEmpty(setFields)) {
    return new Promise(function (resolve, reject) {
      User.findByIdAndUpdateAsync(user.id, {
        $addToSet: addToSetFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedProfile => resolve(updatedProfile))
        .catch(err => reject(err))
    })
  } else {
    return new Promise(function (resolve, reject) {
      User.findByIdAndUpdateAsync(user.id, {
        $set: setFields,
        $addToSet: addToSetFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
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
  findAllCenters
}
