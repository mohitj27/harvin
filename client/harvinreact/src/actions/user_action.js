import axios from 'axios';
import { GET_BATCH, GET_BATCH_SUCCESS, GET_BATCH_ERROR } from './types';
import { notifyLoading,
notifySuccess,
notifyError,
notifyClear, } from './';

export const getBatchList = async (dispatch)=> {
  // dispatch(getBatchListAction());
  dispatch(notifyLoading());
  try {
    const resp = await axios.get('');
    dispatch(notifySuccess());
  } catch (e) {
    dispatch(notifyError());
  } finally {
    dispatch(notifyClear());
  }
};
