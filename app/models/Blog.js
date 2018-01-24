const mongoose = require('mongoose')
const Schema = mongoose.Schema
let BlogSchema = new Schema({
  blogTitle:{
    type:String,
    required:true,
    unique:true
  },
  htmlFilePath: {
    type: String,
    required:true
  },
  uploadDate: {
    type: String,
    default:Date.now().toString()
  },
  hashName:{
    type:String,
    required:true
  },
  blogImages:[{
    type:String,
    required:true


  }]

})

module.exports = mongoose.model("Blog", BlogSchema)
