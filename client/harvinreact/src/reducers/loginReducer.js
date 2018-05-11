import update from 'immutability-helper';
import * as actionTypes from '../actions/types';

const initialState = {
  isLoginInProgress: false,
  isAuthenticated: false
};

const login = (state, action) =>
  update(state, {
    isLoginInProgress: {
      $set: true,
    },
  });

const loginSuccess = (state, action) =>
  update(state, {
    isLoginInProgress: {
      $set: false,
    },
    isAuthenticated: {
      $set: true,
    },
  });

const loginError = (state, action) =>
  update(state, {
    isLoginInProgress: {
      $set: false,
    },
    isAuthenticated: {
      $set: false,
    },
  });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return login(state, action);
    case actionTypes.LOGIN_SUCCESS:
      return loginSuccess(state, action);
    case actionTypes.LOGIN_ERROR:
      return loginError(state, action);
    default:
      return state;
  }
};

export default reducer;