var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;



//User schema
var userSchema = new Schema(
    {
        username: {
            type: String,
            unique:true,
            required:true
        },
        password:{
            type:String
        }
        
    }
);

//passport local mongoose
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);