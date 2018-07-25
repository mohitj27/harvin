const errorHandler = require('../errorHandler')
const NewResult = require('./../models/NewResult');
const R_Question = require('./../models/R_Question');
const R_Test = require('./../models/R_Test');
const _ = require('lodash');
const util = require('util');
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise



INITIALSTATE = {
    SECTIONS: [],
    TESTID: "",
    MTOTAL: 0,
    USER: {},
    SECTIONINIT: {
        section_id: "",
        section_name: "",
        marks: "",
        posMark: 0,
        negMark: 0,
        nCorrectAns: 0,
        nIncorrectAns: 0,
        nQuestionsAnswered: 0,
        nQuestionsUnanswered: 0,
        rightAnsweredQuestions: [],
        wrongAnsweredQuestions: []
    }
}
SECTIONS = JSON.parse(JSON.stringify(INITIALSTATE.SECTIONS));
TESTID = JSON.parse(JSON.stringify(INITIALSTATE.TESTID));
MTOTAL = JSON.parse(JSON.stringify(INITIALSTATE.MTOTAL));
USER = JSON.parse(JSON.stringify(INITIALSTATE.USER));
SECTION = JSON.parse(JSON.stringify(INITIALSTATE.SECTIONINIT));


const getQuestions = function (query) {
    var query = query ? query : {}
    return new Promise(function (resolve, reject) {
        R_Question.find(query)
            .then(foundQuestions => resolve(foundQuestions))
            .catch(err => reject(err))
    })
}

function testGetter(id) {
    var query = query ? query : {}
    return new Promise(function (resolve, reject) {
        R_Test.findOne(query)
            .then(foundTest => resolve(foundTest))
            .catch(err => reject(err))
    })
}

function secNameEval(_id) {
    console.log("global TEST object", util.inspect(TEST, { showHidden: false, depth: null }));
    console.log("type checking :", TEST.sections);
    console.log("test Section: ", TEST.sections)
    console.log("section id : " + _id)
    var sectionObj = _.find(TEST.sections, function (o) { return o._id === _id });
    console.log("Title of Section is : " + sectionObj);
    console.log(TEST.sections);
}
function checkAnswer(questionId, options) {
    return new Promise((resolve, reject) => {
        getQuestions({ _id: questionId }).then((foundQuestions) => {
            // console.log("foundQuestions", foundQuestions);
            // console.log("respective options", options);
            optionsRight = foundQuestions[0].options;
            // if(foundQuestions[0].options.)
            _.remove(optionsRight, (o) => !o.isAns);
            if (options.length === 0) {
                SECTION.nQuestionsUnanswered += 1;
            }
            else if (options.length !== optionsRight.length) {
                SECTION.nIncorrectAns += 1;
                SECTION.nQuestionsAnswered += 1
                SECTION.wrongAnsweredQuestions.push({ questionId: questionId, options: options })
            }
            else {
                SECTION.nCorrectAns += 1;
                SECTION.nQuestionsAnswered += 1;
                SECTION.rightAnsweredQuestions.push(questionId);
            }

            resolve();

        })
    })
    //here i can maintain number of right questions,number of wrong questions
    // and can push question with options selected in NewResult schema for
    // wrong answered question and can push question object id for right answered 
    // question 
}
function secMarksEval(arrQuesWithOptsSelected) {
    return new Promise((resolve, reject) => {
        // console.log("arrQuesWithOptsSelected", arrQuesWithOptsSelected);
        // console.log("==============================getting options and question id of respective question selected==============================")
        // console.log("\n\ninside secMarksEval\n\n")
        var promiseArrOfAnswerCheck = arrQuesWithOptsSelected.map(ObjectHaveOptsAndQuesId => checkAnswer(ObjectHaveOptsAndQuesId._id, ObjectHaveOptsAndQuesId.options));
        console.log("\n\n promiseArrOfAnswerCheck -----\n\n", promiseArrOfAnswerCheck);
        Promise.all(promiseArrOfAnswerCheck).then(() => {
            console.log("promiseArrOfAnswerCheck just ran");
            resolve();
        })
    })
}

function sectionEval(section) {
    // console.log("\n\ninside sectionEval\n\n")
    // console.log(section);
    return new Promise((resolve, reject) => {
        SECTION.section_id = section._id;
        // secNameEval(section._id)
        secMarksEval(section.answer).then(() => {
            // let section = _.clone(SECTION)
            SECTIONS.push(JSON.parse(JSON.stringify(SECTION)));

            TESTID = JSON.parse(JSON.stringify(INITIALSTATE.TESTID));
            MTOTAL = JSON.parse(JSON.stringify(INITIALSTATE.MTOTAL));
            USER = JSON.parse(JSON.stringify(INITIALSTATE.USER));
            SECTION = JSON.parse(JSON.stringify(INITIALSTATE.SECTIONINIT));
            console.log("HEY SECTIONS _____", SECTIONS)
            // console.log("SECTION -----  ", SECTION);
            resolve();
            SECTION = JSON.parse(JSONstringify(INITIALSTATE));
        })
    })
}

const resultTest = function (testId, sectionAnswerMine, resultObj) {
    return new Promise((resolve, reject) => {



        // SECTIONS = JSON.parse(JSON.stringify(INITIALSTATE.SECTIONS));
        TESTID = JSON.parse(JSON.stringify(INITIALSTATE.TESTID));
        MTOTAL = JSON.parse(JSON.stringify(INITIALSTATE.MTOTAL));
        USER = JSON.parse(JSON.stringify(INITIALSTATE.USER));
        SECTION = JSON.parse(JSON.stringify(INITIALSTATE.SECTIONINIT));
        TESTID = testId;

        // console.log("resultObj.constructor===Array", resultObj.constructor === Array)
        // console.log('inside testResult.Controller-------', testId, resultObj);
        // let TEST;
        testGetter(testId).then((testObjRecieved) => {
            console.log(util.inspect(testObjRecieved, { showHidden: false, depth: null }), "testObjRecieved")
            TEST = testObjRecieved;
            // console.log(resultObj)
            // resultObj.forEach((section)=>{
            //     sectionEval(section)
            // })
            let promiseSectionEval = resultObj.map((section, i) => {
                console.log(`'\n===============${i}th section:=================\n`)
                console.log('<<<<<<<<<<<<<<SECTION>>>>>>>>>>>>>\n')
                console.log(section)
                sectionEval(section)
            });
            Promise.all(promiseSectionEval).then(() => {
                console.log("ALL SECTION HAS EVALUTED SUCCESSFULLY______++++++++");
                console.log(SECTIONS)
                resolve(SECTIONS);
            })
        });
        // var a = resultObj
        // var a = JSON.parse(resultObj);
        // console.log(a);
        // console.log(typeof (resultObj))
        // console.log(resultObj.constructor === Array);
        // var NewResult = new NewResult({
        //     testId:testId,
        //     sections:[],

        // })

    })

}

module.exports = {
    resultTest
}