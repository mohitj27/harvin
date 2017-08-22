var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====subjectSchema====
var questionPaperSchema = new Schema({
	questionType: {
		type: String,
		required: true
	},
	questions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Question"
	}]
});

//subject model
module.exports = mongoose.model("QuestionPaper", questionPaperSchema);
