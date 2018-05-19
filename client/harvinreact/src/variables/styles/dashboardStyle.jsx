// ##############################
// // // Dashboard styles
// #############################

import { successColor } from "../styles";

const dashboardStyle = {
  successText: {
    color: successColor
  },
  upArrowCardCategory: {
    width: 14,
    height: 14
  },
  container: {
    flexGrow: 1,
    // marginTop: '50px',
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  addVentorTooltipBtn: {
    marginTop: "50px"
  },
  formStyle: {
    width: "100%",
    height: "100%"
  },
  snackbar: {
    color: "white"
  },
  snackbarLoading: {
    backgroundColor: "orange"
  },
  snackbarSuccess: {
    backgroundColor: "green"
  },
  snackbarError: {
    backgroundColor: "red"
  },
  root: {
    width: "100%"
  },
  tableWrapper: {
    overflowX: "auto"
  },
  fileInput: {
    borderBottom: "1px solid #989898",
    color: "#989898",
    display: "flex",
    alignItems: "flex-end",
    marginBottom: "6px"
  },
  noPad: {
    padding: "0px !important"
  },
  expansionFlex: {
    display: "flex",
    flexDirection: "column"
  },
  ul: {
    listStyleType: "none"
  },
  loading: {
    width: "100%",
    minHeight: "50vh",
    textAlign: "center"
  },
  title: {
    marginTop: "40px",
    marginBottom: "30px",
    textAlign: "center"
  },
  startBtn: {
    textAlign: "center"
  },
  startIcon: {
    marginLeft: "10px"
  },
  nested: {
    paddingLeft: "100px"
  }
};

export default dashboardStyle;
