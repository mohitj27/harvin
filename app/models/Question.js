var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====questionSchema====
var questionSchema = new Schema({
	question: {
		type: String,
		required: true
	},
	options: [{
		type: String,
	}],
	answer: [{
		type: String,
		required: true,
	}]

});

//Question model
module.exports = mongoose.model("Question", questionSchema);

