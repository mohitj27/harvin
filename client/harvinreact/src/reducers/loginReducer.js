import update from 'immutability-helper';
import * as actionTypes from '../actions/types';

const initialState = {
  isLoginInProgress: false,
  isAuthenticated: false,
  isSignupInProgress: false,
  isRegistered: false,
  currentUser: null
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
    currentUser: {
      $set: action.currentUser
    }
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

const signup = (state, action) =>
  update(state, {
    isSignupInProgress: {
      $set: true,
    },
  });

const signupSuccess = (state, action) =>
  update(state, {
    isSignupInProgress: {
      $set: false,
    },
    isRegistered: {
      $set: true,
    },
  });

const signupError = (state, action) =>
  update(state, {
    isSignupInProgress: {
      $set: false,
    },
    isRegistered: {
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

    case actionTypes.SIGNUP:
      return signup(state, action);
    case actionTypes.SIGNUP_SUCCESS:
      return signupSuccess(state, action);
    case actionTypes.SIGNUP_ERROR:
      return signupError(state, action);
    default:
      return state;
  }
};

export default reducer;