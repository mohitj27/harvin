var mongoose = require('mongoose')
var Schema = mongoose.Schema

// ===examSchema====
var enquirySchema = new Schema({
  name: String,
  emailId: String,
  phone: String,
  date: Date,
  centerName: String
})

// Query model
module.exports = mongoose.model('Enquiry', enquirySchema)
