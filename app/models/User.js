var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

//User schema
var userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String
  },

  role: {
    type: [{
      type: String,
      enum: ['admin', 'centre', 'student']
    }],
    default: 'student'
  },

  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile"
  }
});

//passport local mongoose
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
