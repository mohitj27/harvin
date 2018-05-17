import update from 'immutability-helper';
import { GET_ALL_QUESTIONS_SUCCESS} from '../actions/types'

const initialState={
    allQuestions:[],
}

const getAllQuestions=(state,action)=>{
    return update(state,{allQuestions:{$set:action.payload.questions}})
}
export default  (state=initialState,action)=>{
    switch (action.type) {
        case GET_ALL_QUESTIONS_SUCCESS:
            return getAllQuestions(state,action)
        default:
            break;
    }
    return state
}
