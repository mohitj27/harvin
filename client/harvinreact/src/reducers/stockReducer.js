import update from 'immutability-helper';
import * as actionTypes from '../actions/types';

const initialState = {
  isAddStockInProgress: false,
};

const addStock = (state, action) =>
  update(state, {
    isAddStockInProgress: {
      $set: true,
    },
  });

const addStockSuccess = (state, action) =>
  update(state, {
    isAddStockInProgress: {
      $set: false,
    },
  });

const addStockError = (state, action) =>
  update(state, {
    isAddStockInProgress: {
      $set: false,
    },
  });

const resetStockState = (state, action) => initialState;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUBMIT_STOCK_ORDER:
      return addStock(state, action);
    case actionTypes.SUBMIT_STOCK_ORDER_SUCCESS:
      return addStockSuccess(state, action);
    case actionTypes.SUBMIT_STOCK_ORDER_ERROR:
      return addStockError(state, action);
    case actionTypes.RESET_STOCK_STATE:
      return resetStockState(state, action);
    default:
      return state;
  }
};

export default reducer;
