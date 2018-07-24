const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema
Promise = require('bluebird')
Promise.promisifyAll(mongoose)
const bcrypt = require('bcrypt')
const deepPopulate = require('mongoose-deep-populate')(mongoose)

// User schema
var studentSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
})

// Saves the user's password hashed (plain text password storage is not good)
studentSchema.pre('save', function (next) {
  var student = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err || 'Internal Server Error')
      }
      bcrypt.hash(student.password, salt, function (err, hash) {
        if (err) {
          return next(err || 'Internal Server Error')
        }
        student.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

// Create method to compare password input to password saved in database
studentSchema.methods.comparePassword = function (pw, cb) {
  bcrypt.compare(pw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

// passport local mongoose
// studentSchema.plugin(passportLocalMongoose)
studentSchema.plugin(deepPopulate)
module.exports = mongoose.model('HarvinQuizStudent', studentSchema)
