import update from 'immutability-helper';
import {
  SEND_DEPT_ORDER,
  SEND_DEPT_ORDER_SUCCESS,
  SEND_DEPT_ORDER_ERROR,
  CLEAR_NOTIFICATIONS,
} from '../actions/types';

const initialState = {
  sendDeptOrderInProg: false,
  madeTransaction: null,
};
const sendDeptOrder = state => update(state, {
  sendDeptOrderInProg: {
    $set: true,
  },
});

const sendDeptOrderError = (state, action) => update(state, {
  sendDeptOrderInProg: {
    $set: false,
  },

});
const sendDeptOrderSuccess = (state, action) => update(state, {
  sendDeptOrderInProg: {
    $set: false,
  },
});

const clearNotifications = state => state;

export default (state = initialState, action = []) => {
  switch (action.type) {
    case SEND_DEPT_ORDER:
      return sendDeptOrder(state, action);
    case SEND_DEPT_ORDER_SUCCESS:
      return sendDeptOrderSuccess(state, action);
    case SEND_DEPT_ORDER_ERROR:
      return sendDeptOrderError(state, action);
    case CLEAR_NOTIFICATIONS:
      return clearNotifications(state);
    default:
  }
  return state;
};
