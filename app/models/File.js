var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//file schema 
var fileSchema = new Schema( 
  { 
    filePath: { 
      type: String, 
      required: true, 
      trim: true 
    }, 
    fileName: { 
      type: String, 
      required: true 
    }, 
    uploadDate:{ 
      type:Date, 
      default:Date.now 
    }, 
    fileType:String 
  } 
); 

//file model
module.exports = mongoose.model("File", fileSchema);