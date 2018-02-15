var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====subjectSchema====
var qb_classSchema = new Schema({
	className: {
		type: String,
		unique: true,
		required: true
	},

	subjects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "QB_Subject"
	}]
});

//subject model
module.exports = mongoose.model("QB_Class", qb_classSchema);
