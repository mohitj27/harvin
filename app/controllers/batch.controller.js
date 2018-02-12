const errorHandler = require('../errorHandler');
const User = require('./../models/User');
const Batch = require('./../models/Batch');
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise;

const findAllBatch = function () {
  return new Promise(function(resolve, reject) {
    Batch.findAsync({})
    .then(foundBatches => resolve(foundBatches))
    .catch(err => reject(err))
  });
}

const findBatchById = function (batchId) {
  return new Promise(function(resolve, reject) {
    Batch.findByIdAsync(batchId)
    .then(foundBatch => resolve(foundBatch))
    .catch(err => reject(err))
  });
}

const findBatchByBatchName = function (batchName) {
  return new Promise(function(resolve, reject) {
    Batch.findOneAsync({batchName:batchName})
    .then(foundBatch => {
      resolve(foundBatch)
    })
    .catch(err => reject(err))
  });
}

module.exports = {
  findAllBatch,
  findBatchById,
  findBatchByBatchName
}
