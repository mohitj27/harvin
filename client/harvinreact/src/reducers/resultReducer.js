import update from 'immutability-helper';
import * as actionTypes from '../actions/types';

const initialState = {
    allResult: [],
    isFetchingAllResultInProgress: false
  };

const loadResult =(state,action)=>{
        return update(state,{isFetchingAllResultInProgress:{$set:true}})
    }    

const loadResultError =(state,action)=>{
        return update(state,{isFetchingAllResultInProgress:{$set:false}})
    }

const loadResultSuccess =(state,action)=>{
        return update(state,{isFetchingAllResultInProgress:{$set:false}})
    }


const reducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.GET_ALL_RESULTS:
        return loadResult(state, action);
      case actionTypes.GET_ALL_RESULTS_ERROR:
        return loadResultError(state, action);
      case actionTypes.GET_ALL_RESULTS_SUCCESS:
        return loadResultSuccess(state, action);
      default:
        return state;
    }
  };
  
  export default reducer;