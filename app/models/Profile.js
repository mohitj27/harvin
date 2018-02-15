var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

//====Profile Schmea====
var profileSchema = new Schema({
    fullName: {
        type: String
    },

    emailId: {
        type: String
    },

    phone: {
        type: String
    },

    results: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Result"
    }],

    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch"
    },

    progresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Progress"
    }]

});

//profile model
module.exports = mongoose.model("Profile", profileSchema);