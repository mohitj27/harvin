import axios from 'axios';
import {
    GET_TEST_LIST,
    GET_TEST_LIST_SUCCESS,
    GET_TEST_LIST_ERROR,
    GET_TEST,
    GET_TEST_ERROR,
    GET_TEST_SUCCESS,
} from './types'
import {
    notifyLoading,
    notifyClear,
    notifyError,
    notifySuccess
} from '../actions/notify_action';

const getTestList = () => ({
    type: GET_TEST_LIST
})
const getTestListSuccess = tests => ({
    type: GET_TEST_LIST_SUCCESS,
    tests
})
const getTestListError = () => ({
    type: GET_TEST_LIST_ERROR
})

export const fetchTestList = username => async dispatch => {
    dispatch(getTestList());
    dispatch(notifyLoading());
    try {
        const res = await axios.get(`http://localhost:3001/admin/tests/`);
        console.log('res derived', res);

        if (res.data.success) {
            dispatch(getTestListSuccess(res.data.tests));
        } else {
            dispatch(getTestListError());
            dispatch(notifyError(res.data.msg));
        }
    } catch (err) {

        console.log('err', JSON.stringify(err));
        const errMsg = err.response ? err.response.data.msg : 'Error while sending department order';
        dispatch(getTestListError())
        return dispatch(notifyError(errMsg));
    } finally {
        setTimeout(dispatch(notifyClear()), 3000)
    }
}

const getTest = () => ({
    type: GET_TEST
})
const getTestError = () => ({
    type: GET_TEST_ERROR
})
const getTestSuccess = test => ({
    type: GET_TEST_SUCCESS,
    payload: test
})
export const fetchTest = testid => async dispatch => {
    dispatch(getTest());
    dispatch(notifyLoading());
    try {
        const res = await axios.get(`http://localhost:3001/admin/tests/${testid}`);
        if (res.data.success) {
            dispatch(getTestSuccess(res.data.tests));
        } else {
            dispatch(getTestError());
            dispatch(notifyError(res.data.msg));
        }
    } catch (err) {
        const errMsg = err.response ? err.response.data.msg : 'Error while getting the test';
        dispatch(notifyError(errMsg))
    } finally {
        return dispatch(notifyClear())
    }
}