var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====progressSchema====
var progressSchema = new Schema(
	{
        chapter:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Chapter"
        },
        completed:{
            type:String,
            default:"0",
            required:true
        },
	}
);

//Progress model
module.exports = mongoose.model("Progress", progressSchema);