var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

//====subjectSchema====
var qb_subjectSchema = new Schema({
	subjectName: {
		type: String,
		required: true
	},

	addedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
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

qb_subjectSchema.index({ subjectName: 1, addedBy: 1}, { unique: true });

//subject model
module.exports = mongoose.model("QB_Subject", qb_subjectSchema);
