var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var File = require("./File.js");
var fileSchema = File.schema;

//====topicSchema====
var topicSchema = new Schema(
	{
		topicName:String,
		files:[fileSchema]
	}
);

//topic model
module.exports = mongoose.model("Topic", topicSchema);