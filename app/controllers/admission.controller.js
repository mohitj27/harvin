const errorHandler = require('../errorHandler')
const Admission = require('./../models/Admission')
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise

const newAdmission = function (newAdmissionObj) {
  return new Promise(function (resolve, reject) {
    Admission.createAsync(newAdmissionObj)
      .then(createdAdmission => resolve(createdAdmission))
      .catch(err => reject(err))
  })
}

const findAllAdmissions = function () {
  return new Promise(function (resolve, reject) {
    Admission.findAsync()
      .then(foundAdmissions => resolve(foundAdmissions))
      .catch(err => reject(err))
  })
}

const findAdmissionById = function (admissionId) {
  return new Promise(function (resolve, reject) {
    Admission.findByIdAsync(admissionId)
      .then(foundAdmission => resolve(foundAdmission))
      .catch(err => reject(err))
  })
}

const updateAdmissionById = function (admissionId, admissionObj) {
  return new Promise(function (resolve, reject) {
    Admission.findByIdAndUpdateAsync(admissionId, {$set: admissionObj})
      .then(updatedAdmission => resolve(updatedAdmission))
      .catch(err => reject(err))
  })
}

module.exports = {
  newAdmission,
  findAllAdmissions,
  findAdmissionById,
  updateAdmissionById
}
