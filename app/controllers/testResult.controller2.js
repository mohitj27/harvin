const errorHandler = require('../errorHandler')
const NewResult = require('./../models/NewResult');
const R_Question = require('./../models/R_Question');
const R_Test = require('./../models/R_Test');
const _ = require('lodash');
const util = require('util');
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise


const getQuestions = (query) => {
    var query = query ? query : {}
    return new Promise(function (resolve, reject) {
        R_Question.find(query)
            .then(foundQuestions => resolve(foundQuestions))
            .catch(err => reject(err))
    })
}

var secNameEval = (_id) => {

}
var checkAnswer = (questionId, options) => {
    return new Promise((resolve, reject) => {
        getQuestions({ _id: questionId }).then((foundQuestions) => {
            optionsRight = foundQuestions[0].options;
            _.remove(optionsRight, (o) => !o.isAns);
            if (options.length === 0) {
                resolve({ status: 0, question: {} });
            }
            else if (options.length !== optionsRight.length) {
                resolve({
                    status: -1, question: {
                        _id: questionId,
                        options: options
                    }
                });
            }
            else {
                resolve({
                    status: 1, question: {
                        _id: questionId
                    }
                });
            }
        })
    })
}
var secMarksEval = (section) => {

    var Section = {
        id: section._id,
        nAnsweredQues: 0,
        nUnAnsweredQues: 0,
        nRightQues: 0,
        nWrongQues: 0,
        rightAnswers: [],
        wrongAnswers: [],
        marks: 0,
        posMark: section.posMarks,
        negMark: section.negMarks,
    };

    var checkAnswer = (answerObj._id, answerObj.options).then((questionChecked) => {
        if (questionChecked.status === 0) {
            Section.nUnAnsweredQues += 1;

        }
        else if (questionChecked.status === -1) {
            Section.nAnsweredQues += 1;
            Section.nWrongQues += 1;
            Section.wrongAnswers.push(questionChecked.question);
        }
        else {
            Section.nAnsweredQues += 1;
            Section.nRightQues += 1;
            Section.rightAnswers.push(questionChecked.question._id);
        }
        console.log(questionChecked);
        console.log(Section);
    })

    var evaluator = ((answerObj, index) => {
        return new Promise((resolve, reject) => {
            answerObj
        })
        // if (index === (section.answer.length - 1)) {
        //     console.log(`---------------------------------SECTION ${index}--------------------------------`)
        //     resolve(Section);
        // }
    })

    return new Promise((resolve, reject) => {
        promiseArrOfAnser = section.answer.map(evaluator)
    })
}


const resultTest = (testId, sectionAnswerMine, resultObj) => {
    let Sections = [];
    var resultSecEval = (resultSection) => {

        return secMarksEval(resultSection).then((sectionRecieved) => {
            Sections.push(sectionRecieved);
        })
    }
    return new Promise((resolve, reject) => {
        var arrOfPromise = resultObj.map(resultSecEval)
        Promise.all(arrOfPromise).then(() => {
            console.log("Sections : " + Sections);
            resolve(Sections)
        })
    })
}

module.exports = {
    resultTest
}