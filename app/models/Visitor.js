var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//====examSchema====
var visitorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    default: '',
    minlength: 10,
    maxLength: 10
  },
  emailId: {
    type: String,
    required: true,
    default: ''
  },
  classs: {
    type: String,
    required: true,
    enum: [ 'IX', 'X', 'XI', 'XII' ]
  },
  date: {
    type: String,
    required: true,
    default: Date.now()
  }
});

//Query model
module.exports = mongoose.model("Visitor", visitorSchema);
