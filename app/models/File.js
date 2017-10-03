var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var	Topic = require("./Topic");
var	Chapter = require("./Chapter");
var	Subject = require("./Subject");
var	Class = require("./Class");

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
    class:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class"
    },
    subject:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"
    },
    chapter:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter"
    },
    topic:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic"
    }
  } 
); 

//file model
module.exports = mongoose.model("File", fileSchema);