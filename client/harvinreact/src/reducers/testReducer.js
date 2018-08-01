import update from 'immutability-helper';
import * as actionTypes from '../actions/types';
import _ from 'lodash';

const initialState = {
  isFetchTestListInProgress: false,
  tests: [],
  test: '',
  testDeleteError: false,
  testDeletedSuccessfull: false
};

const getTest = (state, action) =>
  update(state, {
    isFetchTestInProgress: {
      $set: true,
    },
  });

const getTestSuccess = (state, action) =>
  update(state, {
    isFetchTestInProgress: {
      $set: false,
    },
    test: {
      $set: action.test,
    },
  });

const getTestError = (state, action) =>
  update(state, {
    isFetchTestInProgress: {
      $set: false,
    }
  });

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

const deleteTestError = (state, action) =>
  update(state, {
    testDeleteError: {
      $set: true
    }
  })
const deleteTestSuccess = (state, action) => {

  // console.log(action.payload);
  console.log("\ndeleteTestSuccess in progress ---------- ", action, _.cloneDeep(state.tests).filter((e) => !action.payload.includes(e._id)), state.tests)
  let actionStateIds = this.action.map(e => e._id);
  let tests = state.tests.filter((e) => !actionStateIds.includes(e._id))
  return update(state, {
    testDeleteError: { $set: false },
    testDeletedSuccessfull: { $set: true },
    tests: { $set: tests }
  });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_TEST_LIST:
      return getTestList(state, action);
    case actionTypes.GET_TEST_LIST_SUCCESS:
      return getTestListSuccess(state, action);
    case actionTypes.GET_TEST_LIST_ERROR:
      return getTestListError(state, action);
    case actionTypes.GET_TEST:
      return getTest(state, action);
    case actionTypes.GET_TEST_SUCCESS:
      return getTestSuccess(state, action);
    case actionTypes.GET_TEST_ERROR:
      return getTestError(state, action);
    case actionTypes.DELETE_TEST_ERROR:
      return deleteTestError(state, action)
    case actionTypes.DELETE_TEST_SUCCESS:
      return deleteTestSuccess(state, action)
    default:
      return state;
  }
};

export default reducer;