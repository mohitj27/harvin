import {
  combineReducers
} from 'redux';
import notifyReducer from './notifyReducer';
import testReducer from './testReducer'
import loginReducer from './loginReducer'
import batchReduces from './batchReducer'
import questionsReducers from './questionsReducer' 

export default combineReducers({
  notify: notifyReducer,
  test: testReducer,
  auth: loginReducer,
  batch: batchReduces,
  questions:questionsReducers,
});