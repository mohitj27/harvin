const errorHandler = require('../errorHandler')
const Institute = require('./../models/Institute')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const createInstitute = function (newInstitute) {
  return new Promise(function (resolve, reject) {
    Institute.createAsync(newInstitute)
      .then(createdInstitute => resolve(createdInstitute))
      .catch(err => reject(err))
  })
}

const updateFieldsInInstituteById = function (institute, addToSetFields, setFields) {
  if (_.isEmpty(addToSetFields)) {
    return new Promise(function (resolve, reject) {
      Institute.findByIdAndUpdateAsync(institute.id, {
        $set: setFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedInstitute => resolve(updatedInstitute))
        .catch(err => reject(err))
    })
  } else if (_.isEmpty(setFields)) {
    return new Promise(function (resolve, reject) {
      Institute.findByIdAndUpdateAsync(institute._id, {
        $addToSet: addToSetFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedInstitute => resolve(updatedInstitute))
        .catch(err => reject(err))
    })
  } else {
    return new Promise(function (resolve, reject) {
      Institute.findByIdAndUpdateAsync(institute._id, {
        $set: setFields,
        $addToSet: addToSetFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedInstitute => resolve(updatedInstitute))
        .catch(err => reject(err))
    })
  }
}

module.exports = {
  createInstitute,
  updateFieldsInInstituteById
}
