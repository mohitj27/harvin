const mongoose = require('mongoose')
const Schema = mongoose.Schema
Promise = require('bluebird')
Promise.promisifyAll(mongoose)
const deepPopulate = require('mongoose-deep-populate')(mongoose)

// file schema
var fileSchema = new Schema({
  fileName: {
    type: String,
    required: true
  },

  filePath: {
    type: String,
    required: true,
    trim: true
  },

  uploadDate: {
    type: String,
    required: true
  },

  fileType: {
    type: String,
    required: true
  },

  fileSize: {
    type: Number,
    required: true
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },

  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },

  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }
})

fileSchema.plugin(deepPopulate)

// file model
module.exports = mongoose.model('File', fileSchema)
