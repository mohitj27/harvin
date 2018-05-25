import update from "immutability-helper";
import {
  GET_ALL_QUESTIONS,
  GET_ALL_QUESTIONS_ERROR,
  GET_ALL_QUESTIONS_SUCCESS,
  CREATE_QUES,
  CREATE_QUES_ERROR,
  CREATE_QUES_SUCCESS
} from "../actions/types";

const initialState = {
  allQuestions: [],
  isCreateQuesInProgress: false,
  isFetchingAllQuestionsInProgress: false,
  isQuestionAddedSuccessfully: false
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

export default (state = initialState, action) => {
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
    default:
      return state;
  }
};
