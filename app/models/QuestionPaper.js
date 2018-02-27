var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(mongoose)
const deepPopulate = require('mongoose-deep-populate')(mongoose)

//= ===subjectSchema====
var questionPaperSchema = new Schema({
  questionType: {
    type: String
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },

  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },

  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }]
})

questionPaperSchema.plugin(deepPopulate)

// subject model
module.exports = mongoose.model('QuestionPaper', questionPaperSchema)
