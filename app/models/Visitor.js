var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));

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
  comments: {
    type: String,
    required: true
  },
  classs: {
    type: String,
    required: true,
    enum: [ 'IX', 'X', 'XI', 'XII', 'XII-Pass']
  },
  date: {
    type: String,
    required: true,
    default: Date.now()
  }
});

//Query model
module.exports = mongoose.model("Visitor", visitorSchema);
