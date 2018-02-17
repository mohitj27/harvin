var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====chapterSchema====
var qb_chapterSchema = new Schema({
	chapterName: {
		type: String,
		required: true
	},

	addedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},

	questions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Question"
	}]
});

qb_chapterSchema.index({ chapterName: 1, addedBy: 1}, { unique: true });

//chapter model
module.exports = mongoose.model("QB_Chapter", qb_chapterSchema);
