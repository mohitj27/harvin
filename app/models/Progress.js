var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====progressSchema====
var progressSchema = new Schema({
	chapter: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Chapter"
	},

	topics: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Topic"
	}],

	completed: {
		type: String,
		default: "0",
		required: true
	},

	status: {
		type: String,
		default: "new",
		required: true
	}
});

//Progress model
module.exports = mongoose.model("Progress", progressSchema);
