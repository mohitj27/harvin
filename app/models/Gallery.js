const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));

//= ===Gallery Schmea====
var gallerySchema = new Schema({
  fileName: {
    type: String,
    required: true
  },
  uploadDate: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true,
    default: "NA"
  },
  src: {
    type: String,
    required: true,
    default: "images/avatar_1.png"
  },
  category: {
    type: String,
    required: true,
    default: "other"
  },
  thumbPath: {
    type: String,
    required: true,
    default: "images/avatar_1.png"
  },
  eventDate: String,
  description: {
    type: String
  }
});

// Gallery model
module.exports = mongoose.model("Gallery", gallerySchema);
