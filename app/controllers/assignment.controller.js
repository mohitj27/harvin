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

const populateFieldOfAssignment = function (assignment, field) {
  return new Promise(function(resolve, reject) {
    Assignment
    .populate(assignment, field)
    .then(populatedAssignment => resolve(populatedAssignment))
    .catch(err => reject(err))
  });
}

const createAssignment = function (newAssignment) {
  return new Promise(function(resolve, reject) {
    Assignment
    .create(newAssignment)
    .then(createdAssignment => resolve(createdAssignment))
    .catch(err => reject(err))
  });
}

module.exports = {
  findAssignmentsByUserId,
  populateFieldOfAssignment,
  createAssignment
}
