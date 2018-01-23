const mongoose = require('mongoose')
const Schema = mongoose.Schema
let BlogSchema = new Schema({
  blogTitle:{
    type:String,
    required:true
  },
  htmlFilePath: {
    type: String,
    required:true
  },
  uploadDate: {
    type: String,
    default:Date.now().toString()
  },

})

module.exports = mongoose.model("Blog", BlogSchema)
