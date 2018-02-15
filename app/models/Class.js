var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

//====subjectSchema====
var classSchema = new Schema({
	className: {
		type: String,
		required: true
	},

	addedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},

	subjects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Subject"
	}]
});

classSchema.index({ className: 1, addedBy: 1}, { unique: true });

//subject model
module.exports = mongoose.model("Class", classSchema);
