var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====examSchema====
var examSchema = new Schema({
	examName: {
		type: String,
		required: true
	},
	examDate: {
		type: String,
		required: true
	},
	examType: {
		type: String,
		required: true
	},
	maximumMarks: {
		type: Number,
		required: true
	},
	passingMarks: {
		type: Number,
		required: true
	},
	negativeMarks: {
		type: Number,
		required: true
	},
	questionPaper: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "QuestionPaper"
	}

});

//Exam model
module.exports = mongoose.model("Exam", examSchema);

