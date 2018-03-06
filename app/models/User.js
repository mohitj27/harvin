const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema
Promise = require('bluebird')
Promise.promisifyAll(mongoose)
const bcrypt = require('bcrypt')
const deepPopulate = require('mongoose-deep-populate')(mongoose)

// User schema
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
    ref: 'Profile'
  }
})

// Saves the user's password hashed (plain text password storage is not good)
// userSchema.pre('save', function (next) {
//   var user = this
//   if (this.isModified('password') || this.isNew) {
//     bcrypt.genSalt(10, function (err, salt) {
//       if (err) {
//         return next(err)
//       }
//       bcrypt.hash(user.password, salt, function (err, hash) {
//         if (err) {
//           return next(err)
//         }
//         user.password = hash
//         next()
//       })
//     })
//   } else {
//     return next()
//   }
// })

// Create method to compare password input to password saved in database
userSchema.methods.comparePassword = function (pw, cb) {
  bcrypt.compare(pw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

// passport local mongoose
userSchema.plugin(passportLocalMongoose)
userSchema.plugin(deepPopulate)
module.exports = mongoose.model('User', userSchema)
