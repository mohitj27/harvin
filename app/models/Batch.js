var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

//====subjectSchema====
var batchSchema = new Schema({
  batchName: {
    type: String,
    required: true
  },
  atCenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Center"
  },
  batchDesc: {
    type: String,
    default: "Default batch description"
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  }],
  exams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam"
  }]
});

//subject model
module.exports = mongoose.model("Batch", batchSchema);
