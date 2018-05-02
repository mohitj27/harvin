var mongoose = require('mongoose')
var Schema = mongoose.Schema

//= ===questionSchema====
var questionSchema = new Schema({
  question: Object,
  options: Object,

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  classs: String,
  subject: String,
  topic: String
})

// Question model
module.exports = mongoose.model('R_Question', questionSchema)
