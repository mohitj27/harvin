const Progress = require('./../models/Progress')
Promise = require('bluebird')
const mongoose = require('mongoose')
const batchController = require('../controllers/batch.controller')
const userController = require('../controllers/user.controller')
const _ = require('lodash')
mongoose.Promise = Promise

const createProgress = function (newProgress) {
  return new Promise(function (resolve, reject) {
    Progress
      .createAsync(newProgress)
      .then(createdProgress => resolve(createdProgress))
      .catch(err => reject(err))
  })
}

const updateProgressByChapterId = function (chapterId, updatedProg) {
  return new Promise(function (resolve, reject) {
    Progress
      .findOneAndUpdate({
        chapter: chapterId
      }, {
        $set: updatedProg
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
      .then(createdProgress => resolve(createdProgress))
      .catch(err => reject(err))
  })
}

const createProgressesForBatch = async function (batch) {
  batch = await batchController.populateFieldsInBatches(batch, ['subjects'])
  let subjects = batch.subjects
  let chapterIds = []
  let progresses = []

  _.forEach(subjects, subject => {
    chapterIds = _.concat(chapterIds, subject.chapters)
  })

  for (let chapter of chapterIds) {
    let createdProgress = await createProgress({
      chapter
    })
    progresses = _.concat(progresses, createdProgress)
  }

  return progresses
}

const updateProgressOfUserOfBatch = async (user, batch) => {
  let progresses = []
  progresses = await createProgressesForBatch(batch)

  user = await userController.populateFieldsInUser(user, ['profile.progresses'])

  let usrPro = user.profile.progresses
  const isSameChapter = function (objVal, othVal) {
    if (objVal.chapter.toString() === othVal.chapter.toString()) return true
    else return false
  }

  let progressesToAdd = _.differenceWith(progresses, usrPro, isSameChapter)
  let progressToDelete = _.difference(progresses, progressesToAdd)
  for (let prog of progressToDelete) {
    prog.remove()
  }

  return progressesToAdd
}

module.exports = {
  createProgress,
  createProgressesForBatch,
  updateProgressOfUserOfBatch,
  updateProgressByChapterId
}
