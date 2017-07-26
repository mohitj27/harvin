var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====subjectSchema====
var profileSchema = new Schema(
	{
		fullName:{
            type:String,
            required:true,
            default:""
        },
        emailId:{
            type:String,
            required:true,
            default:""
        },
        phone:{
            type:String,
            required:true,
            default:""
        },
        batch:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch"
        }
	}
);

//subject model
module.exports = mongoose.model("Profile", profileSchema);