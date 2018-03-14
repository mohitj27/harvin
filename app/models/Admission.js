var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(require('mongoose'))

// ===admissionSchema====
var admissionSchema = new Schema({
  date: Date,
  name: String,
  dob: String,
  profileImg: String,
  phone: String,
  emailId: String,
  gender: String,
  category: String,
  course: String,
  guardiansName: String,
  guardiansPhone: String,
  guardiansOccupation: String,
  address: String,
  permaAddress: String,
  school: String,
  marks: String,
  board: String,
  referral: String
})

// Query model
module.exports = mongoose.model('Admission', admissionSchema)
