var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(mongoose)

//= ===subjectSchema====
var subjectSchema = new Schema({
  subjectName: {
    type: String,
    required: true
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  className: {
    type: String,
    required: true
  },

  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },

  chapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }]
})

subjectSchema.index({
  subjectName: 1,
  className: 1,
  addedBy: 1
}, {
  unique: true
})

// subject model
module.exports = mongoose.model('Subject', subjectSchema)
