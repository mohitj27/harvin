const Assignment = require('./../models/Assignment')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const findAssignmentsByUserId = function (user) {
  return new Promise(function (resolve, reject) {
    Assignment.findAsync({
      addedBy: user._id
    })
      .then(foundAssignments => resolve(foundAssignments))
      .catch(err => reject(err))
  })
}

const findAssignmentsId = function (assignmentId) {
  return new Promise(function (resolve, reject) {
    Assignment.findByIdAsync(assignmentId)
      .then(foundAssignment => resolve(foundAssignment))
      .catch(err => reject(err))
  })
}

const populateFieldOfAssignment = function (assignment, field) {
  return new Promise(function (resolve, reject) {
    Assignment
      .populate(assignment, field)
      .then(populatedAssignment => resolve(populatedAssignment))
      .catch(err => reject(err))
  })
}

const createAssignment = function (newAssignment) {
  return new Promise(function (resolve, reject) {
    Assignment
      .create(newAssignment)
      .then(createdAssignment => resolve(createdAssignment))
      .catch(err => reject(err))
  })
}

const findAssignmentsOfBatchByBatchId = function (batchId) {
  return new Promise(function (resolve, reject) {
    Assignment
      .findAsync({
        batch: batchId
      })
      .then(foundAssignments => resolve(foundAssignments))
      .catch(err => reject(err))
  })
}

const updateAssignmentByAssignmentAndUserId = function (assignmentId, user, newAssignment) {
  return new Promise(function (resolve, reject) {
    Assignment
      .findOneAndUpdateAsync({
        _id: assignmentId,
        addedBy: user._id
      }, {
        $set: {
          assignmentName: newAssignment.assignmentName,
          uploadDate: newAssignment.uploadDate,
          batch: newAssignment.batchId,
          lastSubDate: newAssignment.lastSubDate
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
      .then(createdAssignment => resolve(createdAssignment))
      .catch(err => reject(err))
  })
}

const findAssignmentById = function (assignmentId) {
  return new Promise(function (resolve, reject) {
    Assignment.findByIdAsync(assignmentId)
      .then(foundAssignment => resolve(foundAssignment))
      .catch(err => reject(err))
  })
}

module.exports = {
  findAssignmentsByUserId,
  populateFieldOfAssignment,
  createAssignment,
  findAssignmentsId,
  updateAssignmentByAssignmentAndUserId,
  findAssignmentsOfBatchByBatchId,
  findAssignmentById
}
