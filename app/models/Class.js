var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====subjectSchema====
var classSchema = new Schema(
	{
		className:{
			type:String,
			unique:true,
			required:true
		},
		atCenter: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Center"
		},
		subjects:[
			{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject"
            }
		]
	}
);

//subject model
module.exports = mongoose.model("Class", classSchema);
