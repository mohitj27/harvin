const errorHandler = require('../errorHandler')
const Admission = require('./../models/Admission')
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise

const newAdmission = function newAdmission (newAdmissionObj) {
  console.log(newAdmission)
  return new Promise(function (resolve, reject) {
    Admission.create(newAdmissionObj, function (err, createdAdmission) {
      if (err) {
        return reject(errorHandler.getErrorMessage(err))
      } else {
        return resolve(createdAdmission)
      }
    })
  })
};

module.exports = {
  newAdmission
}
