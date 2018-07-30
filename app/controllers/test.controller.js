const errorHandler = require('../errorHandler')
const R_Test = require('./../models/R_Test')
const _ = require('lodash')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const getTests = function (query) {
  query = query ? query : {}
  return new Promise(function (resolve, reject) {
    R_Test.find(query)
      .then(foundTests => resolve(foundTests))
      .catch(err => reject(err))
  })
}

const addTest = function (testObj) {
  return new Promise(function (resolve, reject) {
    R_Test.create(testObj)
      .then(createdTest => resolve(createdTest))
      .catch(err => reject(err))
  })
}

const removeTests = tests => {
  return new Promise((resolve, reject) => {
    R_Test.deleteMany({ _id: { $in: tests } }, function (err) {
      if (!err) {
        return resolve(true)
      }
      else {
        reject()
      }
    })
  });
};

const populateFieldsInTests = function (tests, path) {
  return new Promise(function (resolve, reject) {
    R_Test.deepPopulate(tests, path)
      .then(populatedTests => resolve(populatedTests))
      .catch(err => reject(err))
  })
}
module.exports = {
  addTest,
  getTests,
  removeTests,
  populateFieldsInTests

}