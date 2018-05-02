import React, { Component, Fragment } from 'react';
import {
  withStyles,
  Button,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  CircularProgress, Grid,
  Paper,
} from 'material-ui';
import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  SdStorage,
  Add,
} from 'material-ui-icons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Editor } from 'draft-js';
import { RegularCard, ItemGrid } from '../'
import { ErrorSnackbar, LoadingSnackbar, SuccessSnackbar } from "../../components/GlobalSnackbar/GlobalSnackbar";
import green from 'material-ui/colors/green';




let options = ['ANSWER 1', 'ANSWER 2', 'ANSWER 3', 'ANSWER 4']
let questions = ['Question 1', 'Question 1', 'Question 1', 'Question 1', 'Question 1']
class Quiz extends Component {
  constructor(props) {
    super(props);
  }

  getOptions = () => {
    return (options.map((option) => {
      return (<FormControlLabel
        control={
          <Checkbox
            onChange={this.handleChange}
            value={options}
          />
        }
        label={option}
      />)
    }))
  }
  getQuestionNavigationContent = () => {
    return (questions.map((question, i) => {
      return (<Button variant="raised" style={{ backgroundColor: green[400], color: 'white' }} aria-label="add" >
        {i + 1}
      </Button>)
    }))
  }
  getCardContent = () => {
    return (<div>
      <Editor style={{ height: '100%', width: '1000px' }}
        editorState={this.props.quizEditorState}
        readOnly={true}
      />
      <FormControl component="fieldset">
        <FormGroup>
          {this.getOptions()}
        </FormGroup>
      </FormControl>

    </div>)
  }
  render() {

    let errorSnackbar = null;
    let successSnackbar = null;
    let processingSnackbar = null;

    if (this.props.errorMessage && this.props.errorMessage !== '')
      errorSnackbar = <ErrorSnackbar errorMessage={this.props.errorMessage} onClearToast={this.props.onClearToast} />

    if (this.props.successMessage && this.props.successMessage !== '')
      successSnackbar = <SuccessSnackbar successMessage={this.props.succuessMessage} onClearToast={this.props.onClearToast} />

    if (this.props.notifyLoading && this.props.notifyLoading !== '')
      processingSnackbar = <LoadingSnackbar notifyLoading={this.props.notifyLoading !== ''} />

    return (<Fragment>
      {errorSnackbar}
      {successSnackbar}
      {processingSnackbar}
      <Grid container="container">
        <ItemGrid xs={12} sm={8} md={8}>
          <Paper style={{padding:'20px'}}>
            {this.getCardContent()}
          </Paper>
        </ItemGrid>
        <ItemGrid xs={12} sm={4} md={4}>
          <RegularCard cardTitle="Add new Question" cardSubtitle="This question will be added into question bank automatically" headerColor="blue" content={this.getQuestionNavigationContent()} />
        </ItemGrid>
      </Grid>
    </Fragment>);
  }
}
Quiz.PropTypes = {
  quiz: PropTypes.object.isRequired,
  quizEditorState: PropTypes.object.isRequired,
}
function mapStateToProps(state){
  return{

  }
}
function mappDispatchToProps(dispatch){
  return 
    bindActionCreators({},dispatch)
}

export default connect(null,null)(Quiz)