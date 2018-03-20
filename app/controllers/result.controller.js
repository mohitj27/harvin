const Result = require('./../models/Result')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const populateFieldsInResults = function (results, path) {
  return new Promise(function (resolve, reject) {
    Result
      .deepPopulate(results, path)
      .then(populatedResults => resolve(populatedResults))
      .catch(err => reject(err))
  })
}

const findAllResults = function () {
  return new Promise(function (resolve, reject) {
    Result.findAsync()
      .then(foundResults => resolve(foundResults))
      .catch(err => reject(err))
  })
}

module.exports = {
  populateFieldsInResults,
  findAllResults
}
