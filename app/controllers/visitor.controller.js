const Visitor = require('./../models/Visitor')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const findAllVisitors = function () {
  return new Promise(function (resolve, reject) {
    Visitor
      .findAsync()
      .then(foundVisitors => resolve(foundVisitors))
      .catch(err => reject(err))
  })
}

module.exports = {
  findAllVisitors
}
