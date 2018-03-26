const errorHandler = require('../errorHandler')
const Enquiry = require('./../models/Enquiry')
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise

const newEnquiry = function (newEnquiryObj) {
  return new Promise(function (resolve, reject) {
    Enquiry.create(newEnquiryObj)
      .then(createdEnquiry => resolve(createdEnquiry))
      .catch(err => reject(err))
  })
}

const findAllEnquiries = function () {
  return new Promise(function (resolve, reject) {
    Enquiry.find()
      .then(foundEnquirys => resolve(foundEnquirys))
      .catch(err => reject(err))
  })
}

const findEnquiryById = function (enquiryId) {
  return new Promise(function (resolve, reject) {
    Enquiry.findById(enquiryId)
      .then(foundEnquiry => resolve(foundEnquiry))
      .catch(err => reject(err))
  })
}

module.exports = {
  newEnquiry,
  findAllEnquiries,
  findEnquiryById
}
