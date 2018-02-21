var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(mongoose)
const deepPopulate = require('mongoose-deep-populate')(mongoose)

//= ===subjectSchema====
var qb_classSchema = new Schema({
  className: {
    type: String,
    required: true
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QB_Subject'
  }]
})

qb_classSchema.index({
  className: 1,
  addedBy: 1
}, {
  unique: true
})
qb_classSchema.plugin(deepPopulate)

// subject model
module.exports = mongoose.model('QB_Class', qb_classSchema)
