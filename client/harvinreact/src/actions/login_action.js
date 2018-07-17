import axios from 'axios';
import jwt from 'jsonwebtoken'
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SIGNUP,
  SIGNUP_ERROR,
  SIGNUP_SUCCESS
} from './types';
import * as notifyActions from './notify_action';
import url from '../config';

const login = () => ({
  type: LOGIN,
});
const loginSuccess = (currentUser) => ({
  type: LOGIN_SUCCESS,
  currentUser
});
const loginError = () => ({
  type: LOGIN_ERROR,
});

const signup = () => ({
  type: SIGNUP,
});
const signupSuccess = () => ({
  type: SIGNUP_SUCCESS,
});
const signupError = () => ({
  type: SIGNUP_ERROR,
});

const saveToken = (token) => {
  window.localStorage.setItem('token', token)
};

export const loginAction = user => async (dispatch) => {
  dispatch(login());
  dispatch(notifyActions.notifyLoading());
  try {
    const res = await axios.post(url + '/student/loginWithPassword', user);
    console.log('res', JSON.stringify(res));
    if (res.data.success) {
      const token = res.data.token
      saveToken(token)
      console.log(token)
      const decodedToken = jwt.decode(token)
      dispatch(loginSuccess(decodedToken));
      dispatch(notifyActions.notifySuccess(res.data.msg));

    } else {

      dispatch(loginError());
      dispatch(notifyActions.notifyError(res.data.msg));
    }

  } catch (err) {
    console.log('err', JSON.stringify(err));

    const errMsg = err.response ? err.data.message : 'Error While Logging in Please try again!';
    dispatch(notifyActions.notifyError(errMsg));
  }
};

export const signupAction = user => async (dispatch) => {
  dispatch(signup());
  dispatch(notifyActions.notifyLoading());
  try {
    const res = await axios.post(url + '/student/harvinSignup', user);
    console.log('res', JSON.stringify(res));

    if (res.data.success) {
      dispatch(signupSuccess());
      dispatch(notifyActions.notifySuccess(res.data.msg));

    } else {
      dispatch(signupError());
      dispatch(notifyActions.notifyError(res.data.msg));
    }

  } catch (err) {
    console.log('err', JSON.stringify(err));

    const errMsg = err.response ? err.data.message : 'Error While Signing in. Please try again!';
    dispatch(notifyActions.notifyError(errMsg));
  }
};