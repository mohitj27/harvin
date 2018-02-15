var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====chapterSchema====
var qb_chapterSchema = new Schema({
	chapterName: {
		type: String,
		unique: true,
		required: true
	},

	questions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Question"
	}]
});

//chapter model
module.exports = mongoose.model("QB_Chapter", qb_chapterSchema);
