const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Promise = require('bluebird')
Promise.promisifyAll(mongoose)
const deepPopulate = require('mongoose-deep-populate')(mongoose)

//= ===chapterSchema====
var qb_chapterSchema = new Schema({
  chapterName: {
    type: String,
    required: true
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QB_Subject'
  }
})

qb_chapterSchema.index({
  chapterName: 1,
  addedBy: 1
}, {
  unique: true
})

qb_chapterSchema.plugin(deepPopulate)

// chapter model
module.exports = mongoose.model('QB_Chapter', qb_chapterSchema)
