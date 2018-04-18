import axios from 'axios';
import * as actionTypes from './types';
import url from '../config/';
import * as notifyActions from './notify_action';


const fetchProducts = () => ({
  type: actionTypes.GET_PRODUCTS,
});

export const fetchProductsSuccess = inventories => ({
  type: actionTypes.GET_PRODUCTS_SUCCESS,
  payload: inventories,
});


export const getProducts = () => async (dispatch) => {
  dispatch(fetchProducts());
  dispatch(notifyActions.notifyLoading());

  try {
    const res = await axios.get(`${url}/api/stock`);
    return dispatch(fetchProductsSuccess(res.data.inventories));
  } catch (err) {
    const errMsg = err.response ? err.response.data.msg : 'Error while fetching products data';
    return dispatch(notifyActions.notifyError(errMsg));
  } finally {
    setTimeout(() => dispatch(notifyActions.notifyClear()), 3000);
  }
};
