var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(mongoose)
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const deepPopulate = require('mongoose-deep-populate')(mongoose)

//= ===examSchema====
var assignmentSchema = new Schema({
  assignmentName: {
    type: String,
    required: true
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  visibleTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  uploadDate: {
    type: String,
    required: true
  },

  lastSubDate: {
    type: String,
  },

  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },

  filePath: {
    type: String,
    required: true,
    trim: true
  }
})

assignmentSchema.index({
  assignmentName: 1,
  addedBy: 1
}, {
  unique: 'Duplicate assignment name!!!'
})
assignmentSchema.plugin(beautifyUnique)
assignmentSchema.plugin(deepPopulate)

// Exam model
module.exports = mongoose.model('Assignment', assignmentSchema)
