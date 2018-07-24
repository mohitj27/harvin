import axios from 'axios';
import jwt from 'jsonwebtoken';
import url from '../config/index.js';

import {
    STUDENT_LOGIN_SUCCESS,
    STUDENT_LOGIN_ERROR
} from './types';

import * as notifyActions from './notify_action';



const saveToken = (token) => {
    window.localStorage.setItem('studentToken', token)
};

const studentLoginSuccess = (currentStudent) => ({
    type: STUDENT_LOGIN_SUCCESS,
    currentStudent
});

const studentLoginError = () => ({
    type: STUDENT_LOGIN_ERROR,
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const loginSubmit = (user) => async (dispatch) => {
    try {
        console.log("user is inside action: " , user, '\n\n')
        // console.log((!validateEmail(user.email) || (user.password.lenght <= 2) || (user.username.lenght <= 2)), "validation check")
        // if (!validateEmail(user.email) || (user.password.lenght <= 2) || (user.password.lenght <= 2)) {
        //    return dispatch(notifyActions.notifyError("Please fill valid details !!!"));
        // }
        console.log("url is :  ", url, '\n\n')
        const res = await axios.post(`${url}/HarvinQuiz/applicant/login`, user);
        console.log("\nresponse from student login: ", res, '\n');
        if (res.data.success) {
            const token = res.data.token;
            saveToken(token);
            console.log('\n\nstudentToken is: ', token, '\n\n');
            const decodedToken = jwt.decode(token);
            dispatch(studentLoginSuccess(decodedToken));
            // dispatch(notifyActions.notifySuccess(res.data.msg));

        } else {

            dispatch(studentLoginError());
            // dispatch(notifyActions.notifyError(res.data.msg));
        }
    } catch (err) {
        console.log('\nerror from student login', JSON.stringify(err), '\n');
        dispatch(studentLoginError());
        dispatch(notifyActions.notifyError("Invalid Username or Password"));
        // const errMsg = err.response ? err.data.message : 'Error While Logging in Please try again!';
        // dispatch(notifyActions.notifyError(errMsg));
    }
}