import { combineReducers } from 'redux';
import orderReducer from './orderReducer';
import notifyReducer from './notifyReducer';
import testReducer from './testReducer'


export default combineReducers({
  order: orderReducer,
  notify: notifyReducer,
  test:testReducer,
});
