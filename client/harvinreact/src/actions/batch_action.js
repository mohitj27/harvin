import axios from 'axios';
import {
  GET_BATCH_LIST,
  GET_BATCH_LIST_SUCCESS,
  GET_BATCH_LIST_ERROR
} from './types';
import * as notifyActions from './notify_action';

const getBatchList = () => ({
  type: GET_BATCH_LIST,
});
const getBatchListSuccess = (batches) => ({
  type: GET_BATCH_LIST_SUCCESS,
  batches
});
const getBatchListError = () => ({
  type: GET_BATCH_LIST_ERROR,
});

export const getBatches = () => async (dispatch) => {
  dispatch(getBatchList());
  dispatch(notifyActions.notifyLoading());
  try {
    const res = await axios.get('http://localhost:3001/admin/batches');
    console.log('res', JSON.stringify(res));
    dispatch(getBatchListSuccess(res.data.batches));
    dispatch(notifyActions.notifyClear());

  } catch (err) {
    console.log('err', JSON.stringify(err));

    const errMsg = err.response ? err.data.message : 'Error While getting batchees !!! Please try again!';
    dispatch(notifyActions.notifyError(errMsg));
  }
};