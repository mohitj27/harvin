import axios from 'axios';
import {
  GET_BATCH,
  GET_BATCH_SUCCESS,
  GET_BATCH_ERROR
} from './types';
import {
  notifyLoading,
  notifySuccess,
  notifyError,
  notifyClear,
} from './';