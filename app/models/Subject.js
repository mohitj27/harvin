var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Class = require("./Class.js");

//====subjectSchema====
var subjectSchema = new Schema(
	{
		subjectName:{
			type:String,
			required:true
		},
		atCenter: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Center"
		},
		className:{
			type:String,
			required:true
		},
		class:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class"
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
