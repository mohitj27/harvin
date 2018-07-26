const errorHandler = require('../errorHandler')
const R_Question = require('./../models/R_Question');
const R_Test = require('./../models/R_Test');
const NewResult = require('./../models/NewResult.js');
const _ = require('lodash');
const util = require('util');
Promise = require('bluebird')
const testController = require("../controllers/test.controller");
const mongoose = require('mongoose')
mongoose.Promise = Promise

const getTests = function (query) {
    query = query ? query : {}
    return new Promise(function (resolve, reject) {
        R_Test.findOne(query)
            .populate({
                path: 'sections.questions',
                populate: {
                    path: 'questions',
                    model: 'Question'
                }
            })
            .exec(function (err, doc) {
                if (err) return reject(err)
                resolve(doc)
            })
    })
}
const testGetter = async function (testId) {
    return new Promise((resolve, reject) => {
        getTests({ _id: testId }).then((foundTest) => {
            // console.log(util.inspect(foundTest, { showHidden: false, depth: null }));
            resolve(foundTest);
        })
    })
}

const compare = (arr1, arr2) => {

    var arr = [];

    arr = arr2.map(e => arr1.includes(e))

    console.log(arr)
    return !arr.includes(false);
}

const checkAnswer = (question, options) => {
    let optionsRight = _.remove(question.options, (o) => o.isAns);
    optionsRight = optionsRight.map(e => e._id);
    // console.log("\n\n=============optionsRight=============\n\n", optionsRight, "\n\n=============optionSelected=============\n\n", options);

    if (options.length === 0) {
        return {
            status: 0,
            question: {}
        }
    }
    else if (optionsRight.length === options.length) {
        if (compare(optionsRight, options)) {
            return {
                status: 1,
                question: {
                    _id: question._id,
                    question: question
                }
            }
        }
        return {
            status: -1,
            question: {
                _id: question._id,
                options: options,
                question: question
            }
        }
    }
    else {
        return {
            status: -1,
            question: {
                _id: question._id,
                options: options
            }
        }
    }
}

const sectionMarksEval = (secAnswered, sectionTest) => {
    let Section = {
        section_id: sectionTest._id,
        section_name: sectionTest.title,
        nAnsweredQues: 0,
        nUnAnsweredQues: 0,
        nRightQues: 0,
        nWrongQues: 0,
        rightAnswers: [],
        wrongAnswers: [],
        marks: 0,
        posMark: sectionTest.posMarks,
        negMark: sectionTest.negMarks,
    };

    secAnswered.answer.forEach(answerSelected => {
        // console.log("answerSelected", answerSelected);
        var Question = sectionTest.questions.filter(e => e._id.toString() === answerSelected._id)[0];
        // console.log("\n\n=======Question and options Selected ========\n\n",
        //     Question, "\n======options are========\n", answerSelected.options, "\n======Answer id recieved========\n", answerSelected._id, "\n\n========================================\n\n");

        var checkAnswerStatus = checkAnswer(Question, answerSelected.options);
        // console.log("checkAnswerStatus", checkAnswerStatus)
        if (checkAnswerStatus.status === 0) {
            Section.nUnAnsweredQues += 1;
        }
        else if (checkAnswerStatus.status === 1) {
            Section.nRightQues += 1;
            Section.marks += Section.posMark
            Section.rightAnswers.push(checkAnswerStatus.question._id)
        }
        else {
            Section.nWrongQues += 1;
            Section.marks += Section.negMark
            Section.wrongAnswers.push(checkAnswerStatus.question);
        }
    })
    // console.log("\nSection is :-----\n", util.inspect(Section, { showHidden: false, depth: null }));
    return Section;
}

const secEval = (testSectionDb, resultSection) => {
    // console.log("testSectionDb\n :-----", testSectionDb, "\n\nresultSection\n", resultSection);
    return sectionMarksEval(resultSection, testSectionDb)
}

const resultTest = (testId, resultObj) => {
    return new Promise((resolve, reject) => {
        testGetter(testId).then(test => {
            var RESULT = {
                testId: "",
                mTotal: 0,
                userId: "",
                sections: []
            }
            RESULT.sections = test.sections.map(testSection => {
                // var a = _.pick(resultObj, testSection._id.toString())
                respectiveResultSection = resultObj.filter(e => e._id === testSection._id.toString())[0];
                //   let arr= []
                return secEval(testSection, respectiveResultSection);
                // console.log(respectiveResultSection);
                // console.log("resultresultresultresultresult\n", result, "\nresultresultresultresultresult\n")
                // console.log(testSection._id);

                // console.log(resultObj.filter(resultSection => testSection._id === resultSection._id)[0])
            });

            // console.log(RESULT);
            resolve(RESULT);
            // console.log("testtesttesttesttesttest-- ", test)
        });
    })
    // console.log(Test);
}

const saveResultToDb = (ResultObj) => {
    // console.log("---++++++++++++++++++++++++++++++++++ RESULT TO STORE ---++++++++++++++++++++++++++++++++++ \n", ResultObj,
    //     "\n---+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n"
    // );

    return new Promise((resolve, reject) => {

        let resultToStore = {
            testId: ResultObj.testId,
            sections: [],
            mTotal: ResultObj.mTotal,
            user: ResultObj.userId,
            testId: ResultObj.testId
        }

        var Result = new NewResult(resultToStore);

        ResultObj.sections.forEach(e => {
            Result.sections.push(e)
        })


        Result.save().then((data) => {
            console.log(data);
            resolve(data);
        })
    })

}

module.exports = {
    resultTest,
    saveResultToDb
}