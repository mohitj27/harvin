var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====Result Schmea====
var resultSchema = new Schema(
	{
		examName:{
            type:String,
            required:true,
        },
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
        nQuestionsAttempted:{
            type:String,
            required:true,
            default:"-1"
        },
        nQuestionsUnAttempted:{
            type:String,
            required:true,
            default:"-1"
        },
        nQuestions:{
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
        }
        
	}
);

//Result model
module.exports = mongoose.model("Result", resultSchema);