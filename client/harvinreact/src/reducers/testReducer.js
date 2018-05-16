import update from 'immutability-helper';
import * as actionTypes from '../actions/types';

const initialState = {
  isFetchTestListInProgress: false,
  tests: [],
  test: ''
};

const getTestList = (state, action) =>
  update(state, {
    isFetchTestListInProgress: {
      $set: true,
    },
  });

const getTestListSuccess = (state, action) =>
  update(state, {
    isFetchTestListInProgress: {
      $set: false,
    },
    tests: {
      $set: action.tests,
    },
  });

const getTestListError = (state, action) =>
  update(state, {
    isFetchTestListInProgress: {
      $set: false,
    }
  });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_TEST_LIST:
      return getTestList(state, action);
    case actionTypes.GET_TEST_LIST_SUCCESS:
      return getTestListSuccess(state, action);
    case actionTypes.GET_TEST_LIST_ERROR:
      return getTestListError(state, action);
    default:
      return state;
  }
};

export default reducer;