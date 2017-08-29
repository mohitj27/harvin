var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====Profile Schmea====
var profileSchema = new Schema(
	{
		fullName:{
            type:String,
            required:true,
            default:"xyz"
        },
        emailId:{
            type:String,
            required:true,
            default:"xyz@abc.com"
        },
        phone:{
            type:String,
            required:true,
            default:"0000000000"
        },
        batch:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch"
        },
        progresses:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Progress"
            }
        ]
        
	}
);

//profile model
module.exports = mongoose.model("Profile", profileSchema);