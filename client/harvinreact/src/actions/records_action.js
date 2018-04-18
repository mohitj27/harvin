import axios from 'axios';
import * as actionTypes from './types';
import url from '../config/';

export const fetchTransactions = () => ({
  type: actionTypes.GET_TRANSACTIONS,
});

export const fetchTransactionsSuccess = transactions => ({
  type: actionTypes.GET_TRANSACTIONS_SUCCESS,
  payload: transactions,
});

export const fetchTransactionsFailed = () => ({
  type: actionTypes.GET_TRANSACTIONS_ERROR,
});

export const getTransactions = () => async (dispatch) => {
  dispatch(fetchTransactions());
  try {
    const res = await axios.get(`${url}/api/transactions`);
    return dispatch(fetchTransactionsSuccess(res.data.transactions));
  } catch (err) {
    return dispatch(fetchTransactionsFailed());
  }
};