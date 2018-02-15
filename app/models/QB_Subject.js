var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====subjectSchema====
var qb_subjectSchema = new Schema({
	subjectName: {
		type: String,
		required: true
	},

	className: {
		type: String,
		required: true
	},

	chapters: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "QB_Chapter"
	}]
});

//subject model
module.exports = mongoose.model("QB_Subject", qb_subjectSchema);
