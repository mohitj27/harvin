var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====examSchema====
var examSchema = new Schema({
  examName: {
    type: String,
    required: true
  },
  atCenter: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Center"
	},
  examDate: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    required: true
  },
  positiveMarks: {
    type: Number,
    required: true
  },
  negativeMarks: {
    type: Number,
    required: true
  },
  totalTime: {
    type: String,
    required: true
  },
  maximumMarks: {
    type: String,
    required: true,
    default: "-1"
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch"
  },
  questionPaper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionPaper"
  }

});

//Exam model
module.exports = mongoose.model("Exam", examSchema);
