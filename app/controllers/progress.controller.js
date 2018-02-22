const Progress = require('./../models/Progress')
Promise = require('bluebird')
const mongoose = require('mongoose')
const _ = require('lodash')
mongoose.Promise = Promise

const createProgress = function (newProgress) {
  return new Promise(function (resolve, reject) {
    Progress
      .createAsync(newProgress)
      .then(createdProgress => resolve(createdProgress))
      .catch(err => reject(err))
  })
}

module.exports = {
  createProgress
}
