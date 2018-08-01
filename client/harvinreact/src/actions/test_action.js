import axios from 'axios';
import {
    GET_TEST_LIST,
    GET_TEST_LIST_SUCCESS,
    GET_TEST_LIST_ERROR,
    GET_TEST,
    GET_TEST_ERROR,
    GET_TEST_SUCCESS,
    SEND_CREATED_TEST,
    SEND_CREATED_TEST_SUCCESS,
    SEND_CREATED_TEST_ERROR,
    DELETE_TEST,
    DELETE_TEST_SUCCESS,
    DELETE_TEST_ERROR,

} from './types'
import {
    notifyLoading,
    notifyClear,
    notifyError,
} from '../actions/notify_action';
import url from '../config'

const getTest = () => ({
    type: GET_TEST
})
const getTestSuccess = test => ({
    type: GET_TEST_SUCCESS,
    test
})
const getTestError = () => ({
    type: GET_TEST_ERROR
})

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

export const fetchTestList = () => async dispatch => {
    dispatch(getTestList());
    dispatch(notifyLoading());
    try {
        const res = await axios.get(`${url}/admin/tests/`);
        console.log('res derived', res.data);

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
        setTimeout(() => {
            dispatch(notifyClear())
        }, 3000)
    }
}

export const fetchTest = testid => async dispatch => {
    dispatch(getTest());
    dispatch(notifyLoading());
    try {
        const res = await axios.get(`${url}/admin/tests/${testid}`);
        if (res.data.success) {
            dispatch(getTestSuccess(res.data.test));
        } else {
            dispatch(getTestError());
            dispatch(notifyError(res.data.msg));
        }
    } catch (err) {
        const errMsg = err.response ? err.response.data.msg : 'Error while getting the test';
        dispatch(notifyError(errMsg))
    } finally {
        setTimeout(() => {
            dispatch(notifyClear())
        }, 3000)
    }
}
const sendCreatedTestAction = () => ({
    type: SEND_CREATED_TEST
})
const sendCreatedTestSuccess = () => ({
    type: SEND_CREATED_TEST_SUCCESS
})
const sendCreatedTestError = () => ({
    type: SEND_CREATED_TEST_ERROR
})

const questionsDeletedSuccess = (tests) => ({
    type: DELETE_TEST_SUCCESS,
    payload: tests,
})

const questionsDeletedError = () => ({
    type: DELETE_TEST_ERROR
})

export const sendCreatedTest = test => async (dispatch) => {

    dispatch(sendCreatedTestAction());
    dispatch(notifyLoading());
    try {
        const res = await axios.post(`${url}/admin/tests/`, test);
        console.log('kuchbhi', res.data);
        if (res.data.success) {
            dispatch(sendCreatedTestSuccess(res.data.msg));
        } else {
            dispatch(sendCreatedTestError());
            dispatch(notifyError(res.data.msg));
        }
    } catch (err) {
        const errMsg = err.response ? err.response.data.msg : 'Error while getting the test';
        dispatch(notifyError(errMsg))
    } finally {
        return dispatch(notifyClear())
    }
}


export const deleteTests = tests => async (dispatch) => {

    dispatch(notifyLoading());
    try {
        const res = await axios.post(`${url}/admin/tests/deleteByIds`, tests);
        console.log('deleted data is ', res.data);
        if (res.data.success) {
            dispatch(questionsDeletedSuccess(tests));
        } else {
            dispatch(questionsDeletedError());
            dispatch(notifyError(res.data.msg));
        }
    } catch (err) {
        const errMsg = err.response ? err.response.data.msg : 'Error while deleting tests';
        dispatch(notifyError(errMsg))
    } finally {
        return dispatch(notifyClear())
    }
}
