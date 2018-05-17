import axios from 'axios';
import {
  
    GET_ALL_QUESTIONS,
    GET_ALL_QUESTIONS_ERROR,
    GET_ALL_QUESTIONS_SUCCESS,
} from './types'
import { notifyLoading, notifyClear, notifyError, notifySuccess } from '.';

const getAllQuestionsAction = () => ({ type: GET_ALL_QUESTIONS });
const getAllQuestionError = () => ({ type: GET_ALL_QUESTIONS_ERROR });
const getAllQuestionSuccess = test => ({ type: GET_ALL_QUESTIONS_SUCCESS, payload: test });
export const getAllQuestions = () => async dispatch => {
    dispatch(getAllQuestionsAction())
    dispatch(notifyLoading())
    try {
        const resp = await axios.get('http://localhost:3001/admin/questions');
        dispatch(getAllQuestionSuccess(resp.data));
        dispatch(notifySuccess());
    } catch (err) {
        const errMsg= err.response? err.response.data.msg:'Error while getting your Questions!';
        dispatch(notifyError(errMsg));
    }finally{
      dispatch(notifyClear());
    }
}
