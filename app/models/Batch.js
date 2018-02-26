var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(mongoose)
const deepPopulate = require('mongoose-deep-populate')(mongoose)

//= ===subjectSchema====
var batchSchema = new Schema({
  batchName: {
    type: String,
    required: true
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  batchDesc: {
    type: String,
    default: 'Default batch description'
  },

  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }]
})

batchSchema.index({
  batchName: 1,
  addedBy: 1
}, {
  unique: true
})

batchSchema.plugin(deepPopulate)

// subject model
module.exports = mongoose.model('Batch', batchSchema)
