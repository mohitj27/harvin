import axios from "axios";
import {
  GET_ALL_QUESTIONS,
  GET_ALL_QUESTIONS_ERROR,
  GET_ALL_QUESTIONS_SUCCESS,
  CREATE_QUES,
  CREATE_QUES_SUCCESS,
  CREATE_QUES_ERROR,
  DELETE_QUES,
  DELETE_QUES_SUCCESS,
  DELETE_QUES_ERROR,
  GET_ALL_RESULTS,
  GET_ALL_RESULTS_ERROR,
  GET_ALL_RESULTS_SUCCESS
} from "./types";
import { notifyLoading, notifyClear, notifyError, notifySuccess } from ".";

const createQues = () => ({ type: CREATE_QUES });
const createQuesError = () => ({ type: CREATE_QUES_ERROR });
const createQuesSuccess = () => ({
  type: CREATE_QUES_SUCCESS
});

const deleteQues =()=>({type: DELETE_QUES});
const deleteQuesError =()=>({type:DELETE_QUES_ERROR});
const deleteQuesSuccess =(id)=>({type:DELETE_QUES_SUCCESS,id:id});

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
    dispatch(notifySuccess(resp.data.msg))
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

export const deleteQuesAction = ques => async dispatch =>{
  dispatch(deleteQues());
  dispatch(notifyLoading());
  console.log(ques);
  
  try {
    const resp = await axios.delete(
      "http://localhost:3001/admin/questions/delete/"+ques
    );
    // console.log('got something in response .',resp);
    
    if(resp.data.success){
      dispatch(deleteQuesSuccess(resp.data.question._id));
    dispatch(notifySuccess("Question has been deleted successfully"));
    }else {
      const errMsg = resp.data & resp.data.msg ? resp.data.msg : "Error while getting your Questions!";
      dispatch(notifyError(errMsg)); 
    }
  } catch (err) {
    dispatch(deleteQuesError());
    const errMsg = err.response
      ? err.response.data.msg
      : "Error while adding this question!";
    dispatch(notifyError(errMsg));
  } finally {
    setTimeout(() => {
      dispatch(notifyClear());
    }, 3000);
  }

}