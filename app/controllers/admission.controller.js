const errorHandler = require('../errorHandler')
const Admission = require('./../models/Admission')
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise

const newAdmission = function newAdmission (newAdmissionObj) {
  return new Promise(function (resolve, reject) {
    Admission.createAsync(newAdmissionObj)
      .then(createdAdmission => resolve(createdAdmission))
      .catch(err => reject(err))
  })
}

const findAllAdmissions = function newAdmission () {
  return new Promise(function (resolve, reject) {
    Admission.findAsync()
      .then(foundAdmissions => resolve(foundAdmissions))
      .catch(err => reject(err))
  })
}

module.exports = {
  newAdmission,
  findAllAdmissions
}
