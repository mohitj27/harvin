import axios from "axios";
import {
  GET_ALL_QUESTIONS,
  GET_ALL_QUESTIONS_ERROR,
  GET_ALL_QUESTIONS_SUCCESS,
  CREATE_QUES,
  CREATE_QUES_SUCCESS,
  CREATE_QUES_ERROR
} from "./types";
import { notifyLoading, notifyClear, notifyError, notifySuccess } from ".";

const createQues = () => ({ type: CREATE_QUES });
const createQuesError = () => ({ type: CREATE_QUES_ERROR });
const createQuesSuccess = () => ({
  type: CREATE_QUES_SUCCESS
});

const getAllQuestionsAction = () => ({ type: GET_ALL_QUESTIONS });
const getAllQuestionError = () => ({ type: GET_ALL_QUESTIONS_ERROR });
const getAllQuestionSuccess = questions => ({
  type: GET_ALL_QUESTIONS_SUCCESS,
  questions
});

export const getAllQuestions = () => async dispatch => {
  dispatch(getAllQuestionsAction());
  dispatch(notifyLoading());
  try {
    const resp = await axios.get("http://localhost:3001/admin/questions");
    dispatch(getAllQuestionSuccess(resp.data.questions));
  } catch (err) {
    const errMsg = err.response
      ? err.response.data.msg
      : "Error while getting your Questions!";
    dispatch(notifyError(errMsg));
  } finally {
    setTimeout(() => {
      dispatch(notifyClear());
    }, 3000);
  }
};

export const createQuesAction = ques => async dispatch => {
  dispatch(createQues());
  dispatch(notifyLoading());
  try {
    const resp = await axios.post(
      "http://localhost:3001/admin/questions",
      ques
    );
    dispatch(createQuesSuccess());
    dispatch(notifySuccess("Question has been added successfully"));
  } catch (err) {
    dispatch(createQuesError());
    const errMsg = err.response
      ? err.response.data.msg
      : "Error while adding this question!";
    dispatch(notifyError(errMsg));
  } finally {
    setTimeout(() => {
      dispatch(notifyClear());
    }, 3000);
  }
};
