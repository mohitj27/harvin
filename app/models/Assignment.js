var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====examSchema====
var assignmentSchema = new Schema({
	assignmentName: {
		type: String,
		required: true
	},
	uploadDate:{ 
		type:String,
		required:true
	},

	lastSubDate: {
		type: String,
		required: true,
	},
	
	filePath: { 
		type: String, 
		required: true, 
		trim: true 
	},
});

//Exam model
module.exports = mongoose.model("Assignment", assignmentSchema);

