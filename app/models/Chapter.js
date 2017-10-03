var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var	Subject = require("./Subject");

//====chapterSchema====
var chapterSchema = new Schema(
	{
		chapterName:{
			type: String,
            unique:true,
            required:true
		},
		subject:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Subject"
		},
		chapterDescription:{
			type:String,
			required:true,
			default:"No description available yet"
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