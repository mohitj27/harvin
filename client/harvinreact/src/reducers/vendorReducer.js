import update from 'immutability-helper';
import * as actionTypes from '../actions/types';

const initialState = {
  vendors: [],
  isAddVendorInProgress: false,
};

const getVendors = (state, action) => state;

const getVendorsSuccess = (state, action) =>
  update(state, {
    vendors: {
      $set: action.payload,
    },
  });

const getVendorsError = (state, action) => state;

const addVendor = (state, action) =>
  update(state, {
    isAddVendorInProgress: {
      $set: true,
    },
  });

const addVendorSuccess = (state, action) =>
  update(state, {
    vendors: {
      $unshift: [action.payload],
    },
    isAddVendorInProgress: {
      $set: false,
    }
  });

const addVendorError = (state, action) =>
  update(state, {
    isAddVendorInProgress: {
      $set: false,
    },
  });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_VENDORS:
      return getVendors(state, action);
    case actionTypes.GET_VENDORS_SUCCESS:
      return getVendorsSuccess(state, action);
    case actionTypes.GET_VENDORS_ERROR:
      return getVendorsError(state, action);
    case actionTypes.ADD_VENDOR:
      return addVendor(state, action);
    case actionTypes.ADD_VENDOR_SUCCESS:
      return addVendorSuccess(state, action);
    case actionTypes.ADD_VENDOR_ERROR:
      return addVendorError(state, action);
    default:
      return state;
  }
};

export default reducer;