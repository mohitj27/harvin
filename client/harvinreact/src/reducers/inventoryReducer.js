import update from 'immutability-helper';
import * as actionTypes from '../actions/types';

const initialState = {
  products: [],
};

const getProducts = state => state;

const getProductsSuccess = (state, action) =>
  update(state, {
    products: {
      $set: action.payload,
    },
  });

const getProductsError = state => state;

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCTS:
      return getProducts(state, action);
    case actionTypes.GET_PRODUCTS_SUCCESS:
      return getProductsSuccess(state, action);
    case actionTypes.GET_PRODUCTS_ERROR:
      return getProductsError(state, action);
    default:
      return state;
  }
};
