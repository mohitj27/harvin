import axios from 'axios';
import * as actionTypes from './types';
import url from '../config/';
import * as notifyActions from './notify_action';

export const fetchVendor = () => ({
  type: actionTypes.GET_VENDORS,
});

export const fetchVendorsSuccess = vendors => ({
  type: actionTypes.GET_VENDORS_SUCCESS,
  payload: vendors,
});

export const fetchVendorsError = () => ({
  type: actionTypes.GET_VENDORS_ERROR,
});

export const addVendor = () => ({
  type: actionTypes.ADD_VENDOR,
});

export const addVendorSuccess = vendor => ({
  type: actionTypes.ADD_VENDOR_SUCCESS,
  payload: vendor,
});

export const addVendorFailed = () => ({
  type: actionTypes.ADD_VENDOR_ERROR,
});


export const getVendors = () => async (dispatch) => {
  dispatch(fetchVendor());
  dispatch(notifyActions.notifyLoading());

  try {
    const res = await axios.get(`${url}/api/vendors`);
    return dispatch(fetchVendorsSuccess(res.data.vendors));
  } catch (err) {
    const errMsg = err.response ? err.response.data.msg : 'Error while fetching vendors data';
    dispatch(fetchVendorsError());
    return dispatch(notifyActions.notifyError(errMsg));
  } finally {
    setTimeout(() => dispatch(notifyActions.notifyClear()), 3000);
  }
};

export const onAddVendor = newVendor => async (dispatch) => {
  dispatch(addVendor());
  dispatch(notifyActions.notifyLoading());

  try {
    const res = await axios.post(`${url}/api/vendors`, {
      name: newVendor.vendorName,
      email: newVendor.vendorEmail,
      phone: newVendor.vendorPhone,
    });
    dispatch(notifyActions.notifySuccess(res.data.msg));
    return dispatch(addVendorSuccess(res.data.vendor));
  } catch (err) {
    const errMsg = err.response ? err.response.data.msg : 'Error while adding new vendor';
    dispatch(addVendorFailed());
    return dispatch(notifyActions.notifyError(errMsg));
  } finally {
    setTimeout(() => dispatch(notifyActions.notifyClear()), 3000);
  }
};


const editVendorAction = () => ({ type: actionTypes.EDIT_VENDOR });
const editVendorSuccess = data => ({ type: actionTypes.EDIT_VENDOR_SUCCESS, payload: data });

export const editDept = dept => async (dispatch) => {
  dispatch(editVendorAction());
  dispatch(notifyActions.notifyLoading());
  try {
    const res = await axios.put(`${url}/api/vendors`, dept);
    dispatch(editVendorSuccess(res.data));
    return dispatch(notifyActions.notifySuccess(res.data.msg));
  } catch (err) {
    const errmsg = err.response ? err.response.data.msg : 'Error while Edit Vendor';
    return dispatch(notifyActions.notifyError(errmsg));
  } finally {
    setTimeout(() => dispatch(notifyActions.notifyClear()), 3000);
  }
};
