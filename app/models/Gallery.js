var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====Gallery Schmea====
var gallerySchema = new Schema(
	{
    fileName: { 
      type: String, 
      required: true 
    },
    uploadDate:{ 
      type:String,
      required:true
    },
    filePath: {
      type: String,
      required: true,
      default: "NA"
    },
    src: {
      type: String,
      required: true,
      default: "images/avatar_1.png"
    },
    category: {
      type: String,
      required: true,
      default: "other"
    },
    description: {
      type: String,
      required: true,
      default: "This is defalut description"
    }
  }
);

//Gallery model
module.exports = mongoose.model("Gallery", gallerySchema);