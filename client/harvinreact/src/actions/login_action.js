import axios from 'axios';
import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_ERROR
} from './types';
import * as notifyActions from './notify_action';

const login = () => ({
    type: LOGIN,
  });
const loginSuccess = () => ({
    type: LOGIN_SUCCESS,
  });
const loginError = () => ({
    type: LOGIN_ERROR,
  });

const saveToken = () => {};

export const loginAction = user => async (dispatch) => {
    dispatch(login());
    dispatch(notifyActions.notifyLoading());
    try {
      const resp = await axios.post('http://localhost:3001/student/loginWithPassword', user);
      console.log('res', JSON.stringify(resp));

      dispatch(loginSuccess());
      dispatch(notifyActions.notifySuccess());
      saveToken();

    } catch (err) {
      console.log('err', JSON.stringify(err));

      const errMsg = err.response ? err.data.message : 'Error While Logging in Please try again!';
      dispatch(notifyActions.notifyError(err));
    }
  };

export const signupAction = user =>async (dispatch) => {
  dispatch(login());
  dispatch(notifyActions.notifyLoading());
  try {
    const resp = await axios.post('http://localhost:3001/student/loginWithPassword', user);
    console.log('res', JSON.stringify(resp));

    dispatch(loginSuccess());
    dispatch(notifyActions.notifySuccess());
    saveToken();

  } catch (err) {
    console.log('err', JSON.stringify(err));

    const errMsg = err.response ? err.data.message : 'Error While Logging in Please try again!';
    dispatch(notifyActions.notifyError(err));
  }
};
