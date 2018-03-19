import {combineReducers} from 'redux'
import flashMessages from './flashMessages'
import login_reducer from './login_reducer'
export default combineReducers({
    flashMessages,
    login_reducer
})
