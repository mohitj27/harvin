import update from 'immutability-helper';
import * as actionTypes from '../actions/types';

const initialState = {
    usernameVal: '',
    emailVal: '',
    passVal: '',
    error: '',
    isAuthenticated: false
};


const studentLoginSuccess = (state, action) => {
    return update(state, {
        isAuthenticated: {
            $set: true,
        },
        currentStudent: {
            $set: action.currentStudent
        }
    });
}

const studentLoginError = (state, action) =>
    update(state, {
        isAuthenticated: {
            $set: false,
        },
    });


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.STUDENT_LOGIN_SUCCESS:
            return studentLoginSuccess(state, action);
        case actionTypes.STUDENT_LOGIN_ERROR:
            return studentLoginError(state, action);
        default:
            return state;
    }
};

export default reducer;