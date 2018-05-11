import update from 'immutability-helper';
import * as actionTypes from '../actions/types';

const initialState = {
  isFetchBatchListInProgress: true,
  batches: [],
};

const getBatchList = (state, action) =>
  update(state, {
    isFetchBatchListInProgress: {
      $set: true,
    },
  });

const getBatchListSuccess = (state, action) =>
  update(state, {
    isFetchBatchListInProgress: {
      $set: false,
    },
    batches: {
      $set: action.batches,
    },
  });

const getBatchListError = (state, action) =>
  update(state, {
    isFetchBatchListInProgress: {
      $set: false,
    }
  });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_BATCH_LIST:
      return getBatchList(state, action);
    case actionTypes.GET_BATCH_LIST_SUCCESS:
      return getBatchListSuccess(state, action);
    case actionTypes.GET_BATCH_LIST_ERROR:
      return getBatchListError(state, action);
    default:
      return state;
  }
};

export default reducer;