const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);
const deepPopulate = require('mongoose-deep-populate')(mongoose);

//= ===Register Schmea====
var RegisterSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },


});

RegisterSchema.plugin(deepPopulate);

// Register model
module.exports = mongoose.model('Register', RegisterSchema);
