import update from 'immutability-helper';
import {
  NOTIFY_SUCCESS,
  NOTIFY_ERROR,
  NOTIFY_LOADING,
  NOTIFY_CLEAR,
} from '../actions/types';

const initialState = {
  loading: '',
  error: '',
  success: '',
  clear: false,
};

const notifyLoading = (state, action) => update(state, {
  loading: { $set: action.payload || 'Loading...' },
  error: { $set: '' },
  success: { $set: '' },
  clear: { $set: false },

});
const notifyError = (state, action) => update(state, {
  loading: { $set: '' },
  error: { $set: action.payload || 'Error :(' },
  success: { $set: '' },
  clear: { $set: false },

});
const notifySuccess = (state, action) => update(state, {
  loading: { $set: '' },
  error: { $set: '' },
  success: { $set: action.payload || 'Success :)' },
  clear: { $set: false },

});
const notifyClear = state => update(state, {
  loading: { $set: '' },
  error: { $set: '' },
  success: { $set: '' },
  clear: { $set: true },

});

export default (state = initialState, action) => {
  switch (action.type) {
    case NOTIFY_LOADING:
      return notifyLoading(state, action);
    case NOTIFY_ERROR:
      return notifyError(state, action);
    case NOTIFY_SUCCESS:
      return notifySuccess(state, action);
    case NOTIFY_CLEAR:
      return notifyClear(state);
    default:
      break;
  }
  return state;
};
