import update from 'immutability-helper';
import {
  GET_DEPT_LIST,
  GET_DEPT_LIST_ERROR,
  GET_DEPT_LIST_SUCCESS,
  ADD_DEPT,
  ADD_DEPT_ERROR,
  ADD_DEPT_SUCCESS,
} from '../actions/types';

const initialState = {
  departments: [],
};


const getDepartments = state => state;
const getDepartmentsError = (state, action) => update(state, {
  getDeptInProg: { $set: false },
  getDeptError: { $set: action.payload.msg },
});
const getDepartmentsSuccess = (state, action) =>
  update(state, {
    departments: { $set: action.payload.departments },
    getDeptInProg: { $set: false },
    getDeptSuccess: { $set: action.payload.msg },

  });

const addDeptAction = state => state;
const addDeptError = state => state;
const addDeptSuccess = (state, action) =>
  update(state, {
    departments: { $unshift: [action.payload.department] },
  });


export default (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_DEPT_LIST:
      return getDepartments(state, action);
    case GET_DEPT_LIST_SUCCESS:
      return getDepartmentsSuccess(state, action);
    case GET_DEPT_LIST_ERROR:
      return getDepartmentsError(state, action);
    case ADD_DEPT:
      return addDeptAction(state, action);
    case ADD_DEPT_SUCCESS:
      return addDeptSuccess(state, action);
    case ADD_DEPT_ERROR:
      return addDeptError(state, action);
    default:
  }
  return state;
};
