var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(require('mongoose'))

// ===examSchema====
var visitorSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true,
    default: '',
    minlength: 10,
    maxLength: 10
  },

  emailId: {
    type: String,
    required: true,
    default: ''
  },

  comments: {
    type: String,
    required: true,
    default: ''
  },

  address: {
    type: String,
    required: true,
    default: ''
  },

  referral: {
    type: String,
    required: true,
    default: ''
  },

  school: {
    type: String,
    required: true,
    default: ''
  },

  aim: {
    type: String,
    required: true,
    default: ''
  },

  date: {
    type: String,
    required: true,
    default: Date.now()
  }
})

// Query model
module.exports = mongoose.model('Visitor', visitorSchema)
