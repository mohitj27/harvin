import update from 'immutability-helper';
import {
  GET_TEST_LIST,
  GET_TEST_LIST_ERROR,
  GET_TEST_LIST_SUCCESS,
  GET_TEST,
  GET_TEST_ERROR,
  GET_TEST_SUCCESS
} from '../actions/types';
import { getTestList } from '../actions';
const initalState = {
  tests: [],
};
const getTestListSuccess = (state, action) => update(state, {
  tests: {
    $set: action.payload,
  },
});
const getTestSuccess = (state, action) => update(state, {
  test: {
    $set: action.payload,
  },
});
export default(state = initalState, action = {}) => {
  switch (action.type) {
    case GET_TEST_LIST:
      return state;
    case GET_TEST_LIST_ERROR:
      return state;
    case GET_TEST_LIST_SUCCESS:
      return getTestListSuccess(state, action);
    case GET_TEST_LIST:
      return state;
    case GET_TEST_LIST_ERROR:
      return state;
    case GET_TEST_LIST_SUCCESS:
      return getTestSuccess(state, action);
    default:
      break;
  }
  return state;
};
