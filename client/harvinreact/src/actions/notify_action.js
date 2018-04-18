import {
  NOTIFY_SUCCESS,
  NOTIFY_ERROR,
  NOTIFY_LOADING,
  NOTIFY_CLEAR,
} from './types';

export const notifyLoading = msg => ({ type: NOTIFY_LOADING, payload: msg });
export const notifyError = msg => ({ type: NOTIFY_ERROR, payload: msg });
export const notifySuccess = msg => ({ type: NOTIFY_SUCCESS, payload: msg });
export const notifyClear = msg => ({ type: NOTIFY_CLEAR, payload: msg });
