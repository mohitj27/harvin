const errorHandler = require('../errorHandler');
const User = require('./../models/User');
const Profile = require('./../models/Profile');
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise;

const findUserByUsername = function (username) {
  return new Promise(function(resolve, reject) {
    User.findOne({username}, function (err, foundUser) {
      if(err) return reject(errorHandler.getErrorMessage(err))
      else return resolve(foundUser)
    })
  });
}

const registerUser = function (username, password) {
  return new Promise(function(resolve, reject) {
    User.register(
      new User({username}), password, function (err, registeredUser) {
        if (err) return reject(errorHandler.getErrorMessage(err))
        else return resolve(registeredUser)
      }
    );
  });
}

const createNewProfile = function (fullName, emailId, phone='0000000000') {
  return new Promise(function(resolve, reject) {
    let newProfile = {
      fullName,
      emailId,
      phone
    }

    Profile.create(newProfile, function (err, createdProfile) {
      if(err) return reject(errorHandler.getErrorMessage(err))
      else return resolve(createdProfile)
    })
  });
}

const addProfileToUser = function (user, profile) {
  return new Promise(function(resolve, reject) {
    User.findOneAndUpdate({
        _id: user._id
      }, {
        $set: {
          profile: profile
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      },
      function(err, updatedUser) {
        if(err) return reject(errorHandler.getErrorMessage(err))
        else return resolve(updatedUser)
      }
    );
  });
}

module.exports = {
  findUserByUsername,
  registerUser,
  createNewProfile,
  addProfileToUser
}
