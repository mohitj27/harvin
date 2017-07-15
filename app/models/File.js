var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//file schema 
var fileSchema = new Schema( 
  { 
    fileName: { 
      type: String, 
      required: true 
    },
    filePath: { 
      type: String, 
      required: true, 
      trim: true 
    }, 
    uploadDate:{ 
      type:String,
      required:true
    }, 
    fileType:{
      type:String,
      required:true  
    },
    fileSize:{
      type:Number,
      required:true
    },
    subjectName:{
      type:String,
      required:true
    },
    chapterName:{
      type:String,
      required:true
    },
    topicName:{
      type:String,
      required:true
    }
  } 
); 

//file model
module.exports = mongoose.model("File", fileSchema);