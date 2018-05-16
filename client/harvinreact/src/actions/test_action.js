import axios from 'axios';
import {
    NOTIFY_CLEAR,
    NOTIFY_LOADING,
    NOTIFY_SUCCESS,
    NOTIFY_ERROR,
    GET_TEST_LIST,
    GET_TEST_LIST_SUCCESS,
    GET_TEST_LIST_ERROR,
    GET_TEST,
    GET_TEST_ERROR,
    GET_TEST_SUCCESS,
    GET_ALL_QUESTIONS,
    GET_ALL_QUESTIONS_ERROR,
    GET_ALL_QUESTIONS_SUCCESS,
} from './types'
import { notifyLoading, notifyClear, notifyError, notifySuccess } from '.';
const getTestListAction = () => ({ type: GET_TEST_LIST })
const getTestListSuccess = tests => ({ type: GET_TEST_LIST_SUCCESS, payload: tests })
const getTestListError = () => ({ type: GET_TEST_LIST_ERROR })

export const getTestList = username => async dispatch => {
    dispatch(notifyLoading);
    dispatch(getTestListAction());
    try {
        const res = await axios.get(`http://localhost:3001/admin/exams/${username}/exams`);
        dispatch(notifySuccess(res.data.msg))
        return dispatch(getTestListSuccess(res.data.tests))
    } catch (err) {
        const errMsg = err.response ? err.response.data.msg : 'Error while sending department order';
        dispatch(getTestListError)
        return dispatch(notifyError(errMsg));
    } finally {
        setTimeout(dispatch(notifyClear), 3000)
    }
}
const getTestAction = () => ({ type: GET_TEST })
const getTestError = () => ({ type: GET_TEST_ERROR })
const getTestSuccess = test => ({ type: GET_TEST_SUCCESS, payload: test })
export const getTest = testid => async dispatch => {
    dispatch(notifyLoading());
    dispatch(getTestAction());
    try {
        const res = await axios.get('');
        dispatch(notifySuccess(res.data.errMsg))
        return dispatch(getTestSuccess(res.data.test))
    } catch (err) {
        const errMsg = err.response ? err.response.data.msg : 'Error while getting the test';
        dispatch(notifyError(errMsg))
    } finally {
        return dispatch(notifyClear())
    }
}

