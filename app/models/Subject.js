var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====subjectSchema====
var subjectSchema = new Schema(
	{
		subjectName:{
			type:String,
			required:true
		},
		className:{
			type:String,
			required:true
		},
		chapters:[
			{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Chapter"
            }
		]
	}
);

//subject model
module.exports = mongoose.model("Subject", subjectSchema);