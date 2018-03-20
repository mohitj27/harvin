const Exam = require('./../models/Exam')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const findExamsByUserId = function (user) {
  return new Promise(function (resolve, reject) {
    Exam.findAsync({
      addedBy: user._id
    })
      .then(foundExams => resolve(foundExams))
      .catch(err => reject(err))
  })
}

const findExamsOfBatchByBatchId = function (batchId) {
  return new Promise(function (resolve, reject) {
    Exam
      .findAsync({
        batch: batchId
      })
      .then(foundExams => resolve(foundExams))
      .catch(err => reject(err))
  })
}

const findExamById = function (examId) {
  return new Promise(function (resolve, reject) {
    Exam.findByIdAsync(examId)
      .then(foundExam => resolve(foundExam))
      .catch(err => reject(err))
  })
}

const populateFieldsInExams = function (exams, path) {
  return new Promise(function (resolve, reject) {
    Exam
      .deepPopulate(exams, path)
      .then(exams => resolve(exams))
      .catch(err => resolve(err))
  })
}

const createOrUpdateExamByExamNameAndUserId = function (newExam, user) {
  return new Promise(function (resolve, reject) {
    Exam.findOneAndUpdateAsync({
      examName: newExam.examName,
      addedBy: user
    }, {
      $set: {
        batch: newExam.batchId,
        examDate: newExam.examDate,
        examType: newExam.examType,
        positiveMarks: newExam.positiveMarks,
        negativeMarks: newExam.negativeMarks,
        maximumMarks: newExam.maximumMarks,
        totalTime: newExam.totalTime,
        addedBy: user
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
      .then(updatedExam => resolve(updatedExam))
      .catch(err => reject(err))
  })
}

const updateExamById = function (examId, newExam, user) {
  return new Promise(function (resolve, reject) {
    Exam.findByIdAndUpdateAsync(examId, {
      $set: {
        batch: newExam.batchId,
        examDate: newExam.examDate,
        examType: newExam.examType,
        positiveMarks: newExam.positiveMarks,
        negativeMarks: newExam.negativeMarks,
        maximumMarks: newExam.maximumMarks,
        totalTime: newExam.totalTime,
        addedBy: user
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
      .then(updatedExam => resolve(updatedExam))
      .catch(err => reject(err))
  })
}

const deleteExamById = function (examId) {
  return new Promise(function (resolve, reject) {
    Exam.findOneAndRemoveAsync(examId)
      .then(removedExam => resolve(removedExam))
      .catch(err => resolve(err))
  })
}

module.exports = {
  findExamsByUserId,
  createOrUpdateExamByExamNameAndUserId,
  findExamById,
  updateExamById,
  deleteExamById,
  findExamsOfBatchByBatchId,
  populateFieldsInExams
}
