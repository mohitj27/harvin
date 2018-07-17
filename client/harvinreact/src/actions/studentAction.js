import axios from 'axios';
import jwt from 'jsonwebtoken';

import {
    STUDENT_LOGIN_SUCCESS,
    STUDENT_LOGIN_ERROR
} from './types';

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
  

export const loginSubmit = (user) => async (dispatch) => {
    try {
        const res = await axios.post("http://localhost:3001/HarvinQuiz/student/login", user);
        console.log("\nresponse from student login: ", res, '\n');
        if (res.data.success) {
            const token = res.data.token;
            saveToken(token);
            console.log('\ntoken is: ', token, '\n');
            const decodedToken = jwt.decode(token);
            dispatch(studentLoginSuccess(decodedToken));
            // dispatch(notifyActions.notifySuccess(res.data.msg));
      
          } else {
      
            dispatch(studentLoginError());
            // dispatch(notifyActions.notifyError(res.data.msg));
          }
    } catch (err) {
        console.log('\nerror from student login', JSON.stringify(err), '\n');
    
        const errMsg = err.response ? err.data.message : 'Error While Logging in Please try again!';
        // dispatch(notifyActions.notifyError(errMsg));
      }
}