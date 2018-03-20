import {ADD_FLASH_MESSAGES} from './types'
export function addFlashMessages(message){
  return{
          type:ADD_FLASH_MESSAGES,
          message:message
  }
}
