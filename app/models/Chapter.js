var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// var Topic = require("./Topic.js");
// var topicSchema = Topic.schema;

//====chapterSchema====
var chapterSchema = new Schema(
	{
		chapterName:String,
		topics:[
			{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Topic"
            }
		]
	}
);

//chapter model
module.exports = mongoose.model("Chapter", chapterSchema);