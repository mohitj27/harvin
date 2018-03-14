const errorHandler = require('../errorHandler')
const Visitor = require('./../models/Visitor')
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise

const findAllVisitors = function () {
  return new Promise(function (resolve, reject) {
    Visitor.findAsync()
      .then(foundVisitors => resolve(foundVisitors))
      .catch(err => reject(err))
  })
}

const addNewVisitor = function addNewVisitor (newVisitor) {
  return new Promise(function (resolve, reject) {
    Visitor.create(newVisitor, function (err, createdVisitor) {
      if (err) {
        return reject(errorHandler.getErrorMessage(err))
      } else {
        return resolve(createdVisitor)
      }
    })
  })
}

const findVisitorByPhone = function (phone) {
  return new Promise(function (resolve, reject) {
    Visitor.findAsync({ phone })
      .then(foundVisitor => resolve(foundVisitor))
      .catch(err => reject(err))
  })
}

module.exports = {
  addNewVisitor,
  findAllVisitors,
  findVisitorByPhone
}
