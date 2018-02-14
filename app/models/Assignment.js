var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

//====examSchema====
var assignmentSchema = new Schema({
  assignmentName: {
    type: String,
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  uploadDate: {
    type: String,
    required: true
  },

  lastSubDate: {
    type: String,
    required: true,
  },

  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch"
  },

  filePath: {
    type: String,
    required: true,
    trim: true
  },
});

//Exam model
module.exports = mongoose.model("Assignment", assignmentSchema);
