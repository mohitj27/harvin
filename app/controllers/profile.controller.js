const errorHandler = require('../errorHandler');
const User = require('./../models/User');
const Profile = require('./../models/Profile');
const Batch = require('./../models/Batch');
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise;

const createNewProfile = function (newProfile) {
  return new Promise(function(resolve, reject) {
    Profile.create(newProfile, function (err, createdProfile) {
      if(err) return reject(errorHandler.getErrorMessage(err))
      else return resolve(createdProfile)
    })
  });
}

const addBatchToProfile = function (batch, profile){
  return new Promise(function(resolve, reject){
    Profile.findByIdAndUpdateAsync(profile._id,{
      $set:{batch:batch}
    },{
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
    .then(updatedProfile => resolve(updatedProfile))
    .catch(err => reject(err))
  })
}

module.exports = {
  createNewProfile,
  addBatchToProfile
}
