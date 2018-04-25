import React from 'react'

import Snackbar from "../Snackbar/Snackbar";
export const ErrorSnackbar = function(props) {
  return (<Snackbar message={props.errorMessage || 'Something went wrong :('} color={"danger"} place={"tr"} open={props.errorMessage !== ''} close={true} onClearToast={props.onClearToast}/>)}

export const SuccessSnackbar = function(props) {
  return (<Snackbar message={props.successMessage || 'Success :)'} color={"success"} place={"tr"} open={props.successMessage !== ''} close={true} onClearToast={props.onClearToast}/>)}

export const LoadingSnackbar = function(props) {
  return (<Snackbar message={'Loading...'} color={"warning"} place={"tr"} open={props.notifyLoading !== ''} close={true} onClearToast={() => {}}/>)}
