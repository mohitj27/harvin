var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(mongoose)

//= ===examSchema====
var linkSchema = new Schema({
  linkTitle: {
    type: String,
    required: true
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  uploadDate: {
    type: String,
    required: true
  },

  filePath: {
    type: String,
    required: true,
    trim: true
  },

  downloads: {
    type: Number,
    default: 0
  },

  cover: {
    type: String,
    trim: true,
    default: 'files.jpg'
  }
})

// Exam model
module.exports = mongoose.model('Link', linkSchema)
