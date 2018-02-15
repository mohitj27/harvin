var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====questionSchema====
var questionSchema = new Schema({
	question: {
		type: String,
		required: true
	},

	newOptions: Object,
	
	options: [{
		type: String,
		require: true
	}],

	answersIndex: [{
		type: Number,
		require: true
	}],

	answers: [{
		type: String,
		required: true,
	}],

	addedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

//Question model
module.exports = mongoose.model("Question", questionSchema);
