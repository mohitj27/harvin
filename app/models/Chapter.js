var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====chapterSchema====
var chapterSchema = new Schema(
	{
		chapterName:{
			type: String,
            unique:true,
            required:true
		},
		chapterDescription:{
			type:String,
			required:true
		},
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