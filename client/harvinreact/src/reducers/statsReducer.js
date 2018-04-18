import update from 'immutability-helper';
import * as actionTypes from '../actions/types';
import updateObject from './utility';

const initialState = {
  transactions: null,
  isFetchTransactionsCompleted: false,
};

const getTransactions = (state, action) => updateObject(state, {});

const getTransactionsSuccess = (state, action) =>
  update(state, {
    transactions: {
      $set: action.payload,
    },
    isFetchTransactionsCompleted: {
      $set: true,
    },

  });

const getTransactionsError = (state, action) =>
  update(state, {
    isFetchTransactionsCompleted: {
      $set: true,
    },
  });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_TRANSACTIONS:
      return getTransactions(state, action);
    case actionTypes.GET_TRANSACTIONS_SUCCESS:
      return getTransactionsSuccess(state, action);
    case actionTypes.GET_TRANSACTIONS_ERROR:
      return getTransactionsError(state, action);
    default:
      return state;
  }
};

export default reducer;
