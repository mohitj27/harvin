import axios from 'axios';
import url from '../config/';
import * as notifyActions from './notify_action';

import {
  SEND_DEPT_ORDER,
  SEND_DEPT_ORDER_ERROR,
  SEND_DEPT_ORDER_SUCCESS,
  CLEAR_NOTIFICATIONS,
} from './types';

export const sendOrder = () => ({
  type: SEND_DEPT_ORDER,
});
export const sendOrderFailure = () => ({
  type: SEND_DEPT_ORDER_ERROR,
});
export const sendOrderSucces = () => ({
  type: SEND_DEPT_ORDER_SUCCESS,
});
export const clearNotifications = () => ({
  type: CLEAR_NOTIFICATIONS,
});
export const sendDeptOrder = order => async (dispatch) => {
  dispatch(sendOrder());
  dispatch(notifyActions.notifyLoading());

  try {
    const res = await axios.post(`${url}/api/order`, order);
    dispatch(sendOrderSucces());
    return dispatch(notifyActions.notifySuccess(res.data.msg));
  } catch (err) {
    const errMsg = err.response ? err.response.data.msg : 'Error while sending department order';
    dispatch(sendOrderFailure());
    return dispatch(notifyActions.notifyError(errMsg));
  } finally {
    setTimeout(() => dispatch(notifyActions.notifyClear()), 3000);
  }
};
