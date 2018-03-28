var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(mongoose)

//= ===videoSchema====
var videoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: String,

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  date: Date,
  views: {
    type: Number,
    default: 0
  }
})

// Exam model
module.exports = mongoose.model('Video', videoSchema)
