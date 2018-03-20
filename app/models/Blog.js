const mongoose = require('mongoose')
const Schema = mongoose.Schema
let BlogSchema = new Schema({
  blogTitle: {
    type: String,
    trim: true,
    required: true
  },
  url: {
    type: String,
    trim: true,
    required: true
  },
  htmlFilePath: {
    type: String,
    required: true
  },
  uploadDate: {
    type: String,

    default: Date.now().toString()
  },
  uploadDateUnix: {
    type: String,
    default: Date.now().toString()
  },
  hashName: {
    type: String,
    required: true
  },
  coverImgName: {
    type: String
  },
  blogImages: [
    {
      type: String,
      default: 'avatar_01.jpg'
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  publish: {
    type: String,
    default: 'off'
  },
  draft: {
    type: String,
    default: 'off'
  },
  meta: {
    type: String,
    trim: true,
    default: ''
  }
})

module.exports = mongoose.model('Blog', BlogSchema)
