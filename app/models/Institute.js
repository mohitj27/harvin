var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Promise = require('bluebird')
Promise.promisifyAll(mongoose)
const deepPopulate = require('mongoose-deep-populate')(mongoose)

//= ===institueSchema====
var instituteSchema = new Schema({
  instituteName: {
    type: String,
    required: true,
    unique: true
  },

  centers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

instituteSchema.plugin(deepPopulate)

// institue model
module.exports = mongoose.model('Institute', instituteSchema)
