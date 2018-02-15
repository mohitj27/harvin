var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

//====chapterSchema====
var chapterSchema = new Schema({
  chapterName: {
    type: String,
    required: true
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  },

  chapterDescription: {
    type: String,
    required: true,
    default: "No description available yet"
  },

  topics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic"
  }]
});

chapterSchema.index({ chapterName: 1, addedBy: 1}, { unique: true });

//chapter model
module.exports = mongoose.model("Chapter", chapterSchema);
