import update from 'immutability-helper';
import * as actionTypes from '../actions/types';

const initialState = {
    result: {},
    isResultFetchInProgress: false,
    isResultFetchError: false
};


const getResult = (state, action) => {

    return update(state, {
        isResultFetchInProgress: {
            $set: true,
        }
    })
};

const getResultSuccess = (state, action) => {
    console.log("actionactionactionactionactionactionactionaction", action);
    console.log("action.payload-------", action.payload)
    return update(state, {
        isResultFetchInProgress: {
            $set: false
        },
        result: {
            $set: action.payload
        }
    })
}

const getResultError = (state, action) => {

    return update(state, {
        isResultFetchError: {
            $set: true,
        },
        isResultFetchInProgress: {
            $set: false
        }
    })
}

const reducer = (state = initialState, action) => {
    console.log("action.typeaction.typeaction.typeaction.type:\n:", action.type);
    switch (action.type) {
        case actionTypes.TEST_RESULT_EVAL:
            return getResult(state, action);
        case actionTypes.GET_TEST_LIST_SUCCESS:
            return getResultSuccess(state, action);
        case actionTypes.TEST_RESULT_EVAL_ERROR:
            return getResultError(state, action);
        default:
            return state;
    }
};

export default reducer;