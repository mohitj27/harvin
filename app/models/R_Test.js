var mongoose = require('mongoose')
var Schema = mongoose.Schema

const deepPopulate = require('mongoose-deep-populate')(mongoose)
//= ===test Schema====
var testSchema = new Schema({
  name: String,
  time: Number,
  created: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  maxMarks: Number,
  sections: [{
    title: String,
    posMarks: Number,
    negMarks: Number,
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'R_Question'
    }]
  }]
})

testSchema.plugin(deepPopulate, {
  populate: {
    'createdBy': {
      select: 'username'
    }
  }
})
// Question model
module.exports = mongoose.model('R_Test', testSchema)