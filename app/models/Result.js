var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====Result Schmea====
var resultSchema = new Schema(
    {
      examTakenDate:{
        type:String,
        required:true,
      },
      mTotal:{
        type:String,
        required:true,
        default:"-1"
      },
      nCorrectAns:{
        type:String,
        required:true,
        default:"-1"
      },
      nIncorrectAns:{
        type:String,
        required:true,
        default:"-1"
      },
      nQuestionsAnswered:{
        type:String,
        required:true,
        default:"-1"
      },
      nQuestionsUnanswered:{
        type:String,
        required:true,
        default:"-1"
      },
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      exam:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam"
      },

    }
);

//Result model
module.exports = mongoose.model("Result", resultSchema);