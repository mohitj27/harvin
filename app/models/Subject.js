var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Chapter = require("./Chapter.js");
var chapterSchema = Chapter.schema;

//====subjectSchema====
var subjectSchema = new Schema(
	{
		subjectName:String,
		chapters:[chapterSchema]
	}
);

//subject model
module.exports = mongoose.model("Subject", subjectSchema);