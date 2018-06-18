import update from "immutability-helper";
import _ from 'lodash';
import {
  GET_ALL_QUESTIONS,
  GET_ALL_QUESTIONS_ERROR,
  GET_ALL_QUESTIONS_SUCCESS,
  CREATE_QUES,
  CREATE_QUES_ERROR,
  CREATE_QUES_SUCCESS,
  DELETE_QUES,
  DELETE_QUES_SUCCESS,
  DELETE_QUES_ERROR
} from "../actions/types";

const initialState = {
  allQuestions: [],
  isCreateQuesInProgress: false,
  isFetchingAllQuestionsInProgress: false,
  isQuestionAddedSuccessfully: false,
  isQuestionDeleteInProgress:false,
  isQuestionDeletedSuccessfully:false
};

const getAllQuestions = (state, action) => {
  return update(state, { isFetchingAllQuestionsInProgress: { $set: true } });
};

const getAllQuestionsSuccess = (state, action) => {
  return update(state, {
    isFetchingAllQuestionsInProgress: { $set: false },
    allQuestions: { $set: action.questions }
  });
};

const getAllQuestionsError = (state, action) => {
  return update(state, { isFetchingAllQuestionsInProgress: { $set: false } });
};

const createQues = (state, action) => {
  return update(state, { isCreateQuesInProgress: { $set: true } });
};

const createQuesSuccess = (state, action) => {
  return update(state, {
    isCreateQuesInProgress: { $set: false },
    isQuestionAddedSuccessfully: { $set: true }
  });
};

const createQuesError = (state, action) => {
  return update(state, {
    isCreateQuesInProgress: { $set: false },
    isQuestionAddedSuccessfully: { $set: false }
  });
};

const deleteQues =(state,action)=>{
  return update(state,{
    isQuestionDeleteInProgress:{$set:true},
    isQuestionDeletedSuccessfully:{$set:false}
  });
};
const deleteQuesSuccess =(state,action)=>{
  console.log('state allquestionds', state.allQuestions);
  console.log('action',action);
  var questions= _.cloneDeep(state.allQuestions).filter((e)=>e._id!==action.id);
  console.log("length is ",questions.length)
  return update(state,{
    isQuestionDeleteInProgress:{$set:false},
    isQuestionDeletedSuccessfully:{$set:true},
    allQuestions:{$set:questions}
      });
};
const deleteQuesError =(state,action)=>{
  return update(state,{
    isQuestionDeleteInProgress:{$set:false},
    isQuestionDeletedSuccessfully:{$set:false},
  });
};

export default (state = initialState, action) => {
  console.log('state', state);

  switch (action.type) {
    case GET_ALL_QUESTIONS:
      return getAllQuestions(state, action);
    case GET_ALL_QUESTIONS_ERROR:
      return getAllQuestionsError(state, action);
    case GET_ALL_QUESTIONS_SUCCESS:
      return getAllQuestionsSuccess(state, action);
    case CREATE_QUES:
      return createQues(state, action);
    case CREATE_QUES_ERROR:
      return createQuesError(state, action);
    case CREATE_QUES_SUCCESS:
      return createQuesSuccess(state, action);
    case DELETE_QUES:
      return deleteQues(state,action)
    case DELETE_QUES_SUCCESS:
      return deleteQuesSuccess(state ,action);
    case DELETE_QUES_ERROR:
      return deleteQuesError(state,action)
    
    default:
      return state;
  }
};
