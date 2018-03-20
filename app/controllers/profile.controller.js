const errorHandler = require('../errorHandler')
const Profile = require('./../models/Profile')
const _ = require('lodash')
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
    Profile.findByIdAndUpdateAsync(profile.id, {
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
    Profile.findByIdAndUpdateAsync(profile.id, {
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

const populateFieldsInProfiles = function (profiles, path) {
  return new Promise(function (resolve, reject) {
    Profile
      .deepPopulate(profiles, path)
      .then(populatedProfiles => resolve(populatedProfiles))
      .catch(err => reject(err))
  })
}

const updateFieldsInProfileById = function (profile, addToSetFields, setFields) {
  if (_.isEmpty(addToSetFields)) {
    return new Promise(function (resolve, reject) {
      Profile.findByIdAndUpdateAsync(profile.id, {
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
      Profile.findByIdAndUpdateAsync(profile._id, {
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
      Profile.findByIdAndUpdateAsync(profile._id, {
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
  createNewProfile,
  addBatchToProfile,
  addResultInProfileById,
  updateFieldsInProfileById,
  populateFieldsInProfiles
}
