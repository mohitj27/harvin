import { combineReducers } from 'redux';
import DeptReducer from './DeptReducer';
import inventoryReducer from './inventoryReducer';
import stockReducer from './stockReducer';
import statsReducer from './statsReducer';
import orderReducer from './orderReducer';
import notifyReducer from './notifyReducer';
import vendorReducer from './vendorReducer';


export default combineReducers({
  dept: DeptReducer,
  invt: inventoryReducer,
  vend: vendorReducer,
  stock: stockReducer,
  order: orderReducer,
  stats: statsReducer,
  notify: notifyReducer,
});
