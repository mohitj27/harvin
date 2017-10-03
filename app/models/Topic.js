var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var	Chapter = require("./Chapter");

//====topicSchema====
var topicSchema = new Schema(
	{
		topicName:{
			type:String,
			unique:true,
			required:true
		},
		topicDescription:{
			type:String,
			required:true,
			default:"No description available yet"
		},
		chapter:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chapter"
		},
		files:[
			{
                type: mongoose.Schema.Types.ObjectId,
                ref: "File"
            }
		]
	}
);

//topic model
module.exports = mongoose.model("Topic", topicSchema);