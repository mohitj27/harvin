const  errorHandler = require('../errorHandler');
const  Visitor = require('./../models/Visitor');
Promise = require('bluebird')
mongoose.Promise = Promise;

const addNewVisitor = function addNewVisitor(newVisitor) {
  return new Promise(function(resolve, reject) {
    Visitor.create(newVisitor, function (err, createdVisitor) {
      if (err){
        return reject(errorHandler.getErrorMessage(err))
      } else {
        return resolve(createdVisitor)
      }
    })
  });
}

module.exports = {
  addNewVisitor
}
