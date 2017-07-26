var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
			required:true
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