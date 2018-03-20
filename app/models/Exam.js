var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(mongoose)
const deepPopulate = require('mongoose-deep-populate')(mongoose)

//= ===examSchema====
var examSchema = new Schema({
  examName: {
    type: String,
    required: true
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  examDate: {
    type: String,
    required: true
  },

  examType: {
    type: String,
    required: true
  },

  positiveMarks: {
    type: Number,
    required: true
  },

  negativeMarks: {
    type: Number,
    required: true
  },

  totalTime: {
    type: String,
    required: true
  },

  maximumMarks: {
    type: String,
    required: true,
    default: '-1'
  },

  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },

  questionPaper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionPaper'
  }
})

examSchema.index({
  examName: 1,
  addedBy: 1
}, {
  unique: true
})

examSchema.plugin(deepPopulate)

// Exam model
module.exports = mongoose.model('Exam', examSchema)
