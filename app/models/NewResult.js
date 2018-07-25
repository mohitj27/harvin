const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);
const deepPopulate = require('mongoose-deep-populate')(mongoose);

//= ===Result Schmea====
var NewResultSchema = new Schema({
    examTakenDate: {
        type: Date, default: Date.now
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'R_Test',
    },
    sections: [
        {
            section_id: {
                type: String,
                // required: true
            },
            section_name: {
                type: String,
                // required: true
            },

            marks: { type: String, default: -1, },
            nWrongQues: {
                type: Number,
                // required: true,
                default: '-1',
            },

            nRightQues: {
                type: Number,
                // required: true,
                default: '-1',
            },

            nAnsweredQues: {
                type: Number,
                // required: true,
                default: '-1',
            },

            nUnAnsweredQues: {
                type: Number,
                // required: true,
                default: '-1',
            },
            rightAnswers: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question'
            }],
            wrongAnswers: [{
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Question'
                },
                options: [{
                    type: String,
                    // required: true
                }]
            }],
            posMark: {
                type: Number,
                // required: true,
                default: '-1'
            },
            negMark: {
                type: Number,
                // required: true,
                default: '-1'
            },
        }
    ],
    mTotal: {
        type: String,
        // required: true,
        default: '-1',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
    },

});

NewResultSchema.plugin(deepPopulate);

// Result model
module.exports = mongoose.model('NewResult', NewResultSchema);
