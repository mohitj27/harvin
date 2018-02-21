const Subject = require('./../models/Subject')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const findAllsubjects = function () {
  return new Promise(function (resolve, reject) {
    Subject.findAsync()
      .then(foundSubjects => resolve(foundSubjects))
      .catch(err => reject(err))
  })
}

const findSubjectsByIds = function (subjectIds) {
  return new Promise(function (resolve, reject) {
    Subject.findAsync({
      _id: {
        $in: subjectIds
      }
    })
      .then(foundSubjects => resolve(foundSubjects))
      .catch(err => reject(err))
  })
}

const findSubjectByName = function (subjectName) {
  return new Promise(function (resolve, reject) {
    Subject.findOneAsync({
      subjectName
    })
      .then(foundSubject => resolve(foundSubject))
      .catch(err => reject(err))
  })
}

const findSubjectBySubjectClassAndUserId = function (subjectName, className, user) {
  return new Promise(function (resolve, reject) {
    Subject.findOneAsync({
      subjectName,
      className,
      addedBy: user
    })
      .then(foundSubject => resolve(foundSubject))
      .catch(err => reject(err))
  })
}

const findSubjectByUserId = function (user) {
  return new Promise(function (resolve, reject) {
    Subject.findAsync({
      addedBy: user
    })
      .then(foundSubjects => resolve(foundSubjects))
      .catch(err => reject(err))
  })
}

const addChapterToSubjectBySubjectClassAndUserId = function (newSubject, className, user, updatedChapter) {
  return new Promise(function (resolve, reject) {
    Subject.findOneAndUpdateAsync({
      subjectName: newSubject.subjectName,
      className,
      addedBy: user
    }, {
      $addToSet: {
        chapters: updatedChapter
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
      .then(updatedSubject => resolve(updatedSubject))
      .catch(err => reject(err))
  })
}

const addClassToSubjectById = function (updatedSubject, updatedClass) {
  return new Promise(function (resolve, reject) {
    Subject.findByIdAndUpdateAsync(updatedSubject._id, {
      $set: {
        class: updatedClass
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
      .then(updatedSubject => resolve(updatedSubject))
      .catch(err => reject(err))
  })
}

module.exports = {
  findAllsubjects,
  findSubjectByName,
  findSubjectBySubjectClassAndUserId,
  findSubjectByUserId,
  addChapterToSubjectBySubjectClassAndUserId,
  addClassToSubjectById,
  findSubjectsByIds
}
