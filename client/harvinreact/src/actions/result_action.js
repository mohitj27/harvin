import {GET_ALL_RESULTS,GET_ALL_RESULTS_ERROR,GET_ALL_RESULTS_SUCCESS} from "./types";

export const getAllResult=()=>{
    dispatch(getAllQuestionsAction());
    dispatch(notifyLoading());
    try {
      const resp = await axios.get("http://localhost:3001/admin/questions");
      dispatch(getAllQuestionSuccess(resp.data.questions));
      dispatch(notifySuccess(resp.data.msg))
    } catch (err) {
      const errMsg = err.response
        ? err.response.data.msg
        : "Error while getting your Questions!";
      dispatch(notifyError(errMsg));
    } finally {
      setTimeout(() => {
        dispatch(notifyClear());
      }, 3000);
    }
}