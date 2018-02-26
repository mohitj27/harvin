var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

//====topicSchema====
var topicSchema = new Schema({
  topicName: {
    type: String,
    required: true
  },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  topicDescription: {
    type: String,
    required: true,
    default: "No description available yet"
  },

  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter"
  },

  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "File"
  }]
});

topicSchema.index({ topicName: 1, addedBy: 1}, { unique: true });

//topic model
module.exports = mongoose.model("Topic", topicSchema);
