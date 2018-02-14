const errorHandler = require('../errorHandler');
const User = require('./../models/User');
const Batch = require('./../models/Batch');
const Assignment = require('./../models/Assignment');
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise;

const findAssignmentsByUserId = function (user) {
  return new Promise(function(resolve, reject) {
    Assignment.findAsync({addedBy: user._id})
    .then(foundAssignments => resolve(foundAssignments))
    .catch(err => reject(err))
  });
}

module.exports = {
  findAssignmentsByUserId
}
