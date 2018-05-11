import {
  combineReducers
} from 'redux';
import orderReducer from './orderReducer';
import notifyReducer from './notifyReducer';
import testReducer from './testReducer'
import loginReducer from './loginReducer'

export default combineReducers({
  order: orderReducer,
  notify: notifyReducer,
  test: testReducer,
  auth: loginReducer
});