const mongoose = require('mongoose')
const Schema = mongoose.Schema


// file schema
var forumSchema = new Schema({
  postName: {
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


})


// file model
module.exports = mongoose.model('Forum', forumSchema)
