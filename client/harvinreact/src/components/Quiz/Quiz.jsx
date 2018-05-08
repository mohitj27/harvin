//TODO SWATI REMOVE CARDS, LEFT ALIGN DETAIL AND REMOVE ACTIVATOR
import React, { Component, Fragment } from "react";
import {
  withStyles,
  Button,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  CircularProgress,
  Grid,
  Paper,
  Badge
} from "material-ui";
import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  SdStorage,
  Add,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "material-ui-icons";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import cx from "classnames";
import PropTypes from "prop-types";
import { RegularCard, ItemGrid } from "../";
import {
  ErrorSnackbar,
  LoadingSnackbar,
  SuccessSnackbar
} from "../../components/GlobalSnackbar/GlobalSnackbar";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import HtmlToReactParser from "html-to-react";
import quizStyles from "../../variables/styles/quizStyles";
import _ from "lodash";
import update from "immutability-helper";
import red from 'material-ui/colors/red';

class Quiz extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    questions: [],
    currentQuestion: "",
    currentOptions: [],
    answers: []
  };
  componentDidMount = () => {
    axios
      .get("http://localhost:3001/admin/questions")
      .then(res => {
        let questions = res.data.questions;
        let answers = [];
        if (questions.length <= 0) return;
        let currentOptions = questions[0].options || [];
        this.setState({
          questions: questions,
          currentQuestion: questions[0],
          currentOptions
        });
        // this.setState({ currentQuestion: questions[0] });
        questions.map((question, i) => {
          answers[i] = { _id: question._id, options: [] };
        });
        this.setState({ answers });
      })
      .catch(err => console.log("err", err));
  };
  handleQuizNavClick = e => {
    const curr = _.find(this.state.questions, function (o) {
      return o._id === e.target.id;
    });

    let currentOptions = curr.options || [];

    this.setState({ currentQuestion: curr, currentOptions });
  };
  handleChangeQuizOptionChange = e => {
    const answerObj = _.find(this.state.answers, o => {
      return o._id == this.state.currentQuestion._id;
    });
    const answerObjIndex = _.findIndex(this.state.answers, o => {
      return o._id == this.state.currentQuestion._id;
    });
    let foundVal = _.indexOf(answerObj.options, e.target.value);
    if (foundVal === -1) {
      answerObj.options.push(e.target.value);
    } else {
      _.remove(answerObj.options, obj => {
        if (obj === e.target.value) return obj === e.target.value;
      });
    }
    let newAnswers = [];
    this.state.answers.forEach((object, val) => {
      val === answerObjIndex
        ? newAnswers.push(answerObj)
        : newAnswers.push(object);
    });

    this.setState({ answers: newAnswers }, () => {
      this.getOptions();
    });
  };
  getOptions = () => {
    const value = [];
    let answerObj = null;

    if (typeof this.state.currentQuestion == "object") {
      answerObj = _.find(this.state.answers, o => {
        return o._id == this.state.currentQuestion._id;
      });
    }
    return this.state.currentOptions.map((option, i) => {
      let checked = false;
      try {
        // console.log("ano", answerObj.options[i], option.text);

        if (
          _.find(answerObj.options, optionObj => {
            return option.text == optionObj;
          })
        ) {
          checked = true;
        }
      } catch (err) {
        console.log(err);
      }
      return (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={this.handleChangeQuizOptionChange}
                value={option.text}
              />
            }
            label={`${i + 1}) ${option.text}`}
          />
        </div>
      );
    });
  };

  onSubmit = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("answers", JSON.stringify(this.state.answers));
    axios
      .post("http://localhost:3001/admin/answers", formData)
      .then(res => {
        console.log("res", res);
        alert(`You have scored ${res.data.marks}`);
      })
      .catch(err => console.log("err", err));
  };
  getQuestionNavigationContent = classes => {
    let selectedQ=_.findIndex(this.state.questions,(question)=>{
      return question._id===this.state.currentQuestion._id
    })
    return this.state.questions.map((question, i) => {
      let badges=[]
      let qStatus=''
      if(i===selectedQ)
      qStatus=classes.selectedQuestion
      if(question.markForLater)
        badges=[...badges,( <Badge badgeContent='!' className={`${classes.badge} ${classes.markBadge}`} color="primary">
.      </Badge>)]
console.log('state',this.state)
try{
    if(this.state.answers[i].options.length>0){
      qStatus=`${qStatus} ${classes.qStatus}`
    }
    console.log('qstatus',qStatus)
  }
    catch(err){
      console.log('qstatus',err)
    }
      return (<Fragment>
        <button
          id={question._id}
          value={question._id}
          key={question._id}
          aria-label="add"
          className={`${classes.quizNavButton} ${qStatus}`}
          onClick={this.handleQuizNavClick}
        >

          {i + 1}
        {badges}
        </button>
        </Fragment>
      );
    });
  };
  handleMarkForLater = event => {

    const currentQuestionState = this.state.currentQuestion;
    currentQuestionState.markForLater = event.target.checked;
    this.setState({ currentQuestion: currentQuestionState })
  }
  handleArrowPrev = e=>{
    let currentIndex=_.findIndex(this.state.questions,(question)=>{
      return question._id===this.state.currentQuestion._id
    })
    console.log('hello',currentIndex)
    if(currentIndex===0 )
    return 

    
      
        currentIndex--
    
    console.log('setting',this.state.questions[currentIndex],currentIndex)
    this.setState({currentQuestion:this.state.questions[currentIndex]})
  }
  handleArrowNext = e=>{
    let currentIndex=_.findIndex(this.state.questions,(question)=>{
      return question._id===this.state.currentQuestion._id
    })
    console.log('hello',currentIndex)
  
    if(currentIndex===this.state.questions.length-1 )
    return 
  
        currentIndex++
    console.log('setting',this.state.questions[currentIndex],currentIndex)
    this.setState({currentQuestion:this.state.questions[currentIndex]})
  }
  getCardContent = (classes) => {
    let htmlToReactParser = new HtmlToReactParser.Parser();
    let reactElement = htmlToReactParser.parse(
      this.state.currentQuestion.question
    );
    const opt = this.getOptions();
    return (
      <div>

        {reactElement}
        {opt}
        <FormControlLabel
          className={classes.markForLater}
          control={
            <Checkbox
              value="markForLater"
              color="primary"
              onChange={this.handleMarkForLater}
              checked={this.state.currentQuestion.markForLater || false}
            />
          }
          label="Mark for later"
        /> </div>
    );
  };
  render() {
    const { classes } = this.props;
    let errorSnackbar = null;
    let successSnackbar = null;
    let processingSnackbar = null;

    if (this.props.errorMessage && this.props.errorMessage !== "")
      errorSnackbar = (
        <ErrorSnackbar
          errorMessage={this.props.errorMessage}
          onClearToast={this.props.onClearToast}
        />
      );

    if (this.props.successMessage && this.props.successMessage !== "")
      successSnackbar = (
        <SuccessSnackbar
          successMessage={this.props.succuessMessage}
          onClearToast={this.props.onClearToast}
        />
      );

    if (this.props.notifyLoading && this.props.notifyLoading !== "")
      processingSnackbar = (
        <LoadingSnackbar notifyLoading={this.props.notifyLoading !== ""} />
      );

    return (
      <Fragment>
        {errorSnackbar}
        {successSnackbar}
        {processingSnackbar}
        <Grid container="container">
          <ItemGrid xs={12} sm={8} md={8}>
            <RegularCard
              cardTitle="Selected Question"
              cardSubtitle=""
              headerColor="blue"
              content={this.getCardContent(classes)}
            />

          </ItemGrid>
          <ItemGrid xs={12} sm={4} md={4}>
            <RegularCard
              cardTitle="Select any question to navigate"
              cardSubtitle=""
              headerColor="blue"
              content={this.getQuestionNavigationContent(classes)}
            />
             <Button
              variant="fab"
              color="primary"
              name="previous"              
              onClick={this.handleArrowPrev}
              style={{ margin: 16 }}
            >
              <KeyboardArrowLeft/>
            </Button>
            <Button
              variant="fab"
              color="primary"
              name="next"
              onClick={this.handleArrowNext}
              style={{ margin: 16 }}
            >
              <KeyboardArrowRight/>
            </Button>
            <Button
              variant="raised"
              color="primary"
              onClick={this.onSubmit}
              style={{ margin: 16 }}
            >
              submit
            </Button>
          </ItemGrid>
        </Grid>
      </Fragment>
    );
  }
}
Quiz.PropTypes = {
  quiz: PropTypes.object.isRequired,
  quizEditorState: PropTypes.object.isRequired
};
function mapStateToProps(state) {
  return {};
}
function mappDispatchToProps(dispatch) {
  return;
  bindActionCreators({}, dispatch);
}

export default withStyles(quizStyles)(Quiz);
