const Register = require('./../models/Register')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const populateFieldsInResults = function (register, path) {
    return new Promise(function (resolve, reject) {
        Register
            .deepPopulate(register, path)
            .then(populatedResults => resolve(populatedResults))
            .catch(err => reject(err))
    })
}

const findAllResults = function () {
    return new Promise(function (resolve, reject) {
        Register.findAsync()
            .then(foundResults => resolve(foundResults))
            .catch(err => reject(err))
    })
}

module.exports = {
    populateFieldsInResults,
    findAllResults
}
