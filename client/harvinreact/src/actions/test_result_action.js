import axios from 'axios';
import {
    TEST_RESULT_EVAL,
    TEST_RESULT_EVAL_SUCCESS,
    TEST_RESULT_EVAL_ERROR,
} from './types'
import {
    notifyLoading,
    notifyClear,
    notifyError,
    notifySuccess
} from '../actions/notify_action';


const submitResult = () => ({
    type: TEST_RESULT_EVAL
})

const resultSuccess = (result) => ({
    type: TEST_RESULT_EVAL_SUCCESS,
    payload: result
})

const submitResultError = () => ({
    type: TEST_RESULT_EVAL_ERROR
})

export const submitResultAction = (url, formData) => async dispatch => {
    console.log(formData)
    dispatch(notifyLoading());


    axios
        .post(url, formData)
        .then(res => {
            alert(`You have scored ${res.data.marks}`);
            dispatch(resultSuccess(res.data));
            dispatch(notifySuccess("Result evaluated successfully"));
            // window.location.href = ('/HarvinQuiz/applicant/result/');

        })
        .catch(err => {
            const errMsg = err.response
                ? err.response.data.msg
                : "Error while saving result !!";
            console.log('err', err);
            dispatch(submitResultError());
            dispatch(notifyError(errMsg));

        });
}


