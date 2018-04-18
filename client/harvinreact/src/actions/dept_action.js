import axios from 'axios';
import url from '../config/';
import * as notifyActions from './notify_action';
import {
  GET_DEPT_LIST,
  GET_DEPT_LIST_SUCCESS,
  ADD_DEPT,
  ADD_DEPT_SUCCESS,
  EDIT_DEPT,
  EDIT_DEPT_SUCCESS,
} from './types';

const fetchDept = () => ({ type: GET_DEPT_LIST });
const fetchDeptSucces = data => ({
  type: GET_DEPT_LIST_SUCCESS,
  payload: data,
});

export const getDeptList = () => async (dispatch) => {
  dispatch(fetchDept());
  dispatch(notifyActions.notifyLoading());
  try {
    const res = await axios.get(`${url}/api/departments`);
    // dispatch(notifyActions.notifySuccess(res.data.msg || 'Got Dept List from server!'));
    return dispatch(fetchDeptSucces(res.data));
  } catch (err) {
    const errmsg = err.response ? err.response.data.msg : 'Error while Fetching Department List';
    return dispatch(notifyActions.notifyError(errmsg));
  } finally {
    setTimeout(() => dispatch(notifyActions.notifyClear()), 3000);
  }
};
const addDeptAction = () => ({ type: ADD_DEPT });
const addDeptSucces = data => ({
  type: ADD_DEPT_SUCCESS,
  payload: data,
});

export const addDept = dept => async (dispatch) => {
  dispatch(addDeptAction());
  dispatch(notifyActions.notifyLoading());
  try {
    const res = await axios.post(`${url}/api/departments`, dept);
    dispatch(addDeptSucces(res.data));
    return dispatch(notifyActions.notifySuccess(res.data.msg));
  } catch (err) {
    const errmsg = err.response ? err.response.data.msg : 'Error while Adding Department';
    return dispatch(notifyActions.notifyError(errmsg));
  } finally {
    setTimeout(() => dispatch(notifyActions.notifyClear()), 3000);
  }
};

const editDeptAction = () => ({ type: EDIT_DEPT });
const editDeptSuccess = data => ({ type: EDIT_DEPT_SUCCESS, payload: data });

export const editDept = dept => async (dispatch) => {
  dispatch(editDeptAction());
  dispatch(notifyActions.notifyLoading());
  try {
    const res = await axios.put(`${url}/api/departments`, dept);
    dispatch(editDeptSuccess(res.data));
    return dispatch(notifyActions.notifySuccess(res.data.msg));
  } catch (err) {
    const errmsg = err.response ? err.response.data.msg : 'Error while Adding Department';
    return dispatch(notifyActions.notifyError(errmsg));
  } finally {
    setTimeout(() => dispatch(notifyActions.notifyClear()), 3000);
  }
};
