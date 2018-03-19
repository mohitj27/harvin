import axios from 'axios'
import LOGIN from './types'
import setAuthorizationToken from '../utils/setAuthorization'
import jwttoken from 'jsonwebtoken'
import {SET_CURRENT_USER} from '../actions/types'


export function setCurrentUser(user){
  return{
    type:SET_CURRENT_USER,
    user
  }
}

export function AuthAction(user){
  return dispatch=> {
    return axios.post('/student/login/',user).then((res)=>{
      const token=res.data.token
      localStorage.setItem('jwttoken',token)
      setAuthorizationToken(token)
      dispatch(setCurrentUser(jwttoken.decode(token)))
    })
  }
}
