var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(mongoose)
const deepPopulate = require('mongoose-deep-populate')(mongoose)

//= ===questionSchema====
var questionSchema = new Schema({
  question: {
    type: String,
    required: true
  },

  newOptions: Object,

  options: [{
    type: String,
    require: true
  }],

  answersIndex: [{
    type: Number,
    require: true
  }],

  answers: [{
    type: String,
    required: true
  }],

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QB_Class'
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QB_Subject'
  },

  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QB_Chpater'
  }
})

questionSchema.plugin(deepPopulate)

// Question model
module.exports = mongoose.model('Question', questionSchema)
