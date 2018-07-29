import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "react-quill/dist/quill.snow.css";
import { Redirect, withRouter } from "react-router-dom";
import {
  Button,
  Grid,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Checkbox,
  IconButton,
  withStyles
} from "material-ui";
import {
  ErrorSnackbar,
  SuccessSnackbar,
  LoadingSnackbar
} from "../../components/GlobalSnackbar/GlobalSnackbar";
import addQuesStyle from "../../variables/styles/addQuesStyle";
import * as actions from "../../actions";
import ReactQuill from "react-quill";
import { ExpandMore, Add, Clear } from "material-ui-icons";
import axios from "axios";
import { v4 } from "uuid";
import HtmlToReact from "html-to-react";
import update from "immutability-helper";
import { loginAction, notifyClear } from "../../actions";
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import * as _ from "lodash";
const HtmlToReactParser = HtmlToReact.Parser;

class AddQues extends Component {
  state = {
    text: "",
    questions: [],
    options: [],
    optionsHtml: [],
    questionType: "",
    isQuestionAddedSuccessfully: false
  };

  handleChange = value => {
    this.setState({ text: value });
  };

  handleSelectChange = event => {
    this.setState(function (prevState, props) {
      return { [event.target.name]: event.target.value }
    });
    console.log("state changed questionType")
  };

  handleOptionsChange = (value, pos) => {
    const optHtml = this.state.optionsHtml;
    const newData = update(optHtml, { [pos]: { $set: value } });
    // console.log("value", newData);
    this.setState({ optionsHtml: newData });
  };

  handleCheckboxChanged = index => {
    const newState = update(this.state, {
      options: {
        [index]: {
          $toggle: ["isAns"]
        }
      }
    });

    this.setState({ options: newState.options });
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    console.log("next", nextProps);

    if (
      !nextProps.isCreateQuesInProgress &&
      nextProps.isQuestionAddedSuccessfully
    ) {
      return {
        isQuestionAddedSuccessfully: nextProps.isQuestionAddedSuccessfully,
        text: "",
        options: [],
        optionsHtml: [],
        isFetchingAllQuestionsInProgress: false
      };
    }
    return null;
  };

  onSubmit = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("question", this.state.text);

    const prevOptions = _.cloneDeep(this.state.options);
    const updatedOptions = prevOptions.map((opt, i) => {
      opt.text = this.state.optionsHtml[i];
      return opt;
    });
    formData.append("options", JSON.stringify(updatedOptions));
    this.props.onCreateQues(formData);
  };

  onAddOption = () => {
    const currentLenght = this.state.options.length;

    const newOpt = {
      text: (
        <ReactQuill
          value={this.state.optionsHtml[currentLenght + 1] || ""}
          onChange={value => {
            this.handleOptionsChange(value, currentLenght);
          }}
          ref={editor => (this.editor = editor)}
          style={{ backgroundColor: "white" }}
          modules={{
            toolbar: [[{ script: "sub" }, { script: "super" }], ["image"]]
          }}
        />
      ),
      html: this.state.options[currentLenght + 1] || "",
      isAns: false,
      _id: v4() //fn to generate UID for Options Important so that test can differentiate between options
    };

    const newState = update(this.state, {
      options: {
        $push: [newOpt]
      }
    });

    this.setState({ options: newState.options });
  };

  onRemoveOption = () => {
    const newState = update(this.state, {
      options: {
        $splice: [[this.state.options.length - 1, 1]]
      }
    });

    this.setState({ options: newState.options });
  };

  isAtleastOneOptionSelected = () => {
    for (let i = 0; i < this.state.options.length; i++) {
      if (this.state.options[i].isAns === true) return true;
    }

    return false;
  };

  // getPrevQuesOptions = opts => {
  //   const options = opts || [];
  //   let htmlToReactParser = new HtmlToReactParser();

  //   return options.map((opt, i) => {
  //     let reactElement = htmlToReactParser.parse(opt.text);

  //     return (
  //       <Fragment>
  //         <Checkbox
  //           checked={opt.isAns}
  //           value={`${opt.text}`}
  //           disabled={true}
  //           color="primary"
  //         />

  //         {reactElement}
  //       </Fragment>
  //     );
  //   });
  // };

  render() {
    let addButton = null;

    let successSnackbar =
      this.props.successMessage !== "" ? (
        <SuccessSnackbar
          successMessage={this.props.successMessage}
          onClearToast={this.props.onClearToast}
        />
      ) : null;
    let errorSnackbar =
      this.props.errorMessage !== "" ? (
        <ErrorSnackbar
          errorMessage={this.props.errorMessage}
          onClearToast={this.props.onClearToast}
        />
      ) : null;
    let loadingSnackbar =
      this.props.notifyLoading !== "" ? <LoadingSnackbar /> : null;

    addButton = (
      <IconButton
        variant="fab"
        mini
        color="primary"
        onClick={this.onAddOption}
        style={{ marginLeft: 16 }}
      >
        <Add />
      </IconButton>
    );

    let options = this.state.options.map((opt, i) => {
      let removeButton = null;
      removeButton = (
        <IconButton
          variant="fab"
          mini
          color="secondary"
          onClick={this.onRemoveOption}
          style={{ marginRight: 16 }}
        >
          <Clear />
        </IconButton>
      );
      return (
        <div style={{ marginRight: 50 }}>
          <Checkbox
            checked={opt.isAns}
            onChange={() => {
              this.handleCheckboxChanged(i);
            }}
            value={opt.text}
            color="primary"
          />

          {opt.text}

          {removeButton}
        </div>
      );
    });
    return (
      <div>
        {successSnackbar}
        {errorSnackbar}
        {loadingSnackbar}

        <Grid style={{ display: "flex" }} justify="center">
          <h3>Add New Question</h3>
        </Grid>
        <ReactQuill
          value={this.state.text}
          onChange={this.handleChange}
          ref={editor => (this.editor = editor)}
          style={{ backgroundColor: "white" }}
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["clean"],
              ["link", "image", "formula"]
            ]
          }}
        />
        <ExpansionPanel style={{ marginTop: 16, marginBottom: 16 }}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography>Choose Correct Answer</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid style={{ display: "flex", flexWrap: "wrap" }}>
              {options}
              {addButton}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Grid style={{ margin: "0px auto" }}>
          <InputLabel htmlFor="selectAutoWidth">Question Type : </InputLabel>
          <Select
            value={this.state.questionType}
            onChange={this.handleSelectChange}
            input={<Input name="questionType" id="selectAutoWidth" />}
            style={{ width: "20%" }}
            autoWidth
          >
            <MenuItem value={"default"}>
              <em>None</em>
            </MenuItem>
            <MenuItem value={"physics"}>physics</MenuItem>
            <MenuItem value={"chemistry"}>chemistry</MenuItem>
            <MenuItem value={"math"}>math</MenuItem>
            <MenuItem value={"botany"}>botany</MenuItem>
            <MenuItem value={"zoology"}>zoology</MenuItem>
            <MenuItem value={"biology"}>biology</MenuItem>
            <MenuItem value={"english"}>english</MenuItem>
            <MenuItem value={"mixed"}>mixed</MenuItem>
          </Select>
          <Button
            variant="raised"
            color="primary"
            onClick={this.onSubmit}
            style={{ margin: 16 }}
            disabled={!this.isAtleastOneOptionSelected()}
          >
            submit
          </Button>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    successMessage: state.notify.success,
    errorMessage: state.notify.error,
    notifyLoading: state.notify.loading,
    notifyClear: state.notify.clear,
    isCreateQuesInProgress: state.questions.isCreateQuesInProgress,
    questions: state.questions.allQuestions,
    isQuestionAddedSuccessfully: state.questions.isQuestionAddedSuccessfully
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCreateQues: ques => dispatch(actions.createQuesAction(ques)),
    onClearToast: () => dispatch(notifyClear())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withStyles(addQuesStyle)(AddQues)
  )
);
