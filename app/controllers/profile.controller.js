const errorHandler = require('../errorHandler')
const Profile = require('./../models/Profile')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const createNewProfile = function (newProfile) {
  return new Promise(function (resolve, reject) {
    Profile.create(newProfile, function (err, createdProfile) {
      if (err) return reject(errorHandler.getErrorMessage(err))
      else return resolve(createdProfile)
    })
  })
}

const addBatchToProfile = function (batch, profile) {
  return new Promise(function (resolve, reject) {
    Profile.findByIdAndUpdateAsync(profile._id, {
      $set: {
        batch: batch
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
      .then(updatedProfile => resolve(updatedProfile))
      .catch(err => reject(err))
  })
}

const addResultInProfileById = function (profile, result) {
  return new Promise(function (resolve, reject) {
    Profile.findByIdAndUpdateAsync(profile._id, {
      $addToSet: {
        results: result
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
      .then(updatedProfile => resolve(updatedProfile))
      .catch(err => reject(err))
  })
}

const populateFieldInProfile = function (profile, field) {
  return new Promise(function (resolve, reject) {
    Profile
      .populate(profile, field)
      .then(populatedProfile => resolve(populatedProfile))
      .catch(err => reject(err))
  })
}

const updateFieldsInProfileById = function (profile, addToSetFields, setFields) {
  console.log('addtoset', typeof addToSetFields)
  // addToSetFields = addToSetFields.toObject({})
  // setFields = setFields.toObject()

  // addToSetFields = JSON.stringify(addToSetFields)
  return new Promise(function (resolve, reject) {
    Profile.findByIdAndUpdateAsync(profile._id, {
      $addToSet: {results: setFields},
      $set: setFields
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
      .then(updatedProfile => resolve(updatedProfile))
      .catch(err => reject(err))
  })
}

module.exports = {
  createNewProfile,
  addBatchToProfile,
  addResultInProfileById,
  populateFieldInProfile,
  updateFieldsInProfileById
}
