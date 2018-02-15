var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//TODO: no need for this schema
//====subjectSchema====
var centerSchema = new Schema({
  centerName: {
    type: String,
    unique: true,
    required: true
  },
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment"
  }],
  batches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch"
  }],
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class"
  }],
  exams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam"
  }],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  qb_classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "QB_Class"
  }]
});

//subject model
module.exports = mongoose.model("Center", centerSchema);
