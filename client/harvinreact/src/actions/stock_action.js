import axios from 'axios';
import * as actionTypes from './types';
import url from '../config/';
import * as notifyActions from './notify_action';

export const addStock = () => ({
  type: actionTypes.SUBMIT_STOCK_ORDER,
});

export const addStockSuccess = (item, transaction) => ({
  type: actionTypes.SUBMIT_STOCK_ORDER_SUCCESS,
  item,
  transaction,
});

export const addStockFailed = () => ({
  type: actionTypes.SUBMIT_STOCK_ORDER_ERROR,
});

export const resetStockState = () => ({
  type: actionTypes.RESET_STOCK_STATE,
});


export const onResetStockState = () => async (dispatch) => {
  dispatch(resetStockState());
};


export const onStockSubmit = newStock => async (dispatch) => {
  dispatch(addStock());
  dispatch(notifyActions.notifyLoading());
    
  try {
    const res = await axios.post(`${url}/api/stock`, newStock);
    dispatch(addStockSuccess());
    dispatch(notifyActions.notifySuccess(res.data.msg));
    return dispatch(onResetStockState());
  } catch (err) {
    const errMsg = err.response ? err.response.data.msg : 'Error while adding inventory item into stock';
    dispatch(addStockFailed());
    return dispatch(notifyActions.notifyError(errMsg));
  } finally {
    setTimeout(() => dispatch(notifyActions.notifyClear()), 3000);
  }
};
