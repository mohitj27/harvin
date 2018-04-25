import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions";
import * as actionTypes from "../../actions/types";
import dashboardStyle from "../../variables/styles/dashboardStyle";
import { Send } from 'material-ui-icons';
import { ErrorSnackbar, LoadingSnackbar, SuccessSnackbar } from "../../components/GlobalSnackbar/GlobalSnackbar";
import * as _ from 'lodash'
import { withStyles, CircularProgress, Grid, Button } from "material-ui";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { RegularCard, ItemGrid, CustomInput } from "../../components";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import update from 'immutability-helper';
import axios from 'axios'

class AddQues extends Component {
  state = {
    editorStateQ: EditorState.createEmpty(),
    editorState1: EditorState.createEmpty(),
    editorState2: EditorState.createEmpty(),
    editorState3: EditorState.createEmpty(),
    editorState4: EditorState.createEmpty(),
    ques: '',
    opt1: '',
    opt2: '',
    opt3: '',
    opt4: '',
    iQues: null,
    iOpt1: null,
    iOpt2: null,
    iOpt3: null,
    iOpt4: null
  }

  onEditorStateChangeQ = (editorState) => {
    this.setState({ editorStateQ: editorState, ques: draftToHtml(convertToRaw(editorState.getCurrentContent())) });
  };

  onEditorStateChange1 = (editorState) => {
    this.setState({ editorState1: editorState, opt1: draftToHtml(convertToRaw(editorState.getCurrentContent()))  });
  };

  onEditorStateChange2 = (editorState) => {
    this.setState({ editorState2: editorState, opt2: draftToHtml(convertToRaw(editorState.getCurrentContent()))  });
  };

  onEditorStateChange3 = (editorState) => {
    this.setState({ editorState3: editorState, opt3: draftToHtml(convertToRaw(editorState.getCurrentContent()))  });
  };

  onEditorStateChange4 = (editorState) => {
    this.setState({ editorState4: editorState, opt4: draftToHtml(convertToRaw(editorState.getCurrentContent()))  });
  };

  returnPromise = (imageObject) => {
    return new Promise((resolve, reject) => {
      if (imageObject) {
        resolve({
          data: {
            link: imageObject.localSrc
          }
        });
      } else
        reject()
    });
  }

  createImageObject = (file) => {
    return { file: file, localSrc: URL.createObjectURL(file) }
  }

  saveImgToState = (file, field) => {
    const imageObject = this.createImageObject(file)
    this.setState({ [field]: imageObject.file })
    return this.returnPromise(imageObject)
  }

  uploadCallbackQ = (file) => {
    return this.saveImgToState(file, 'iQues')
  }

  uploadCallback1 = (file) => {
    return this.saveImgToState(file, 'iOpt1')
  }

  uploadCallback2 = (file) => {
    return this.saveImgToState(file, 'iOpt2')
  }

  uploadCallback3 = (file) => {
    return this.saveImgToState(file, 'iOpt3')
  }

  uploadCallback4 = (file) => {
    return this.saveImgToState(file, 'iOpt4')
  }

  onInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onAddQuesSubmit = (data) => {
    axios.post('http://localhost:3001/admin/questionBank', data).then(res => console.log('res', res)).catch(err => console.log('err', err))
  }

  getCardContent() {
    const { editorStateQ, editorState1, editorState2, editorState3, editorState4 } = this.state;
    // console.log('editorState', convertToRaw(editorState.getCurrentContent()));
    const stockSubmitBtn = (<Button variant="fab" color="primary" aria-label="Submit" disabled={this.props.isAddStockInProgress} onClick={() => {
      let formData = new FormData();
      formData.append("imgs", this.state.imgs);
      return this.onAddQuesSubmit(formData)
    }
    }>
      <Send />
    </Button>)
    return (<div>
      <Editor editorState={editorStateQ} toolbar={{
        image: {
          uploadCallback: this.uploadCallbackQ,
          previewImage: true
        }
      }} toolbarClassName="toolbarClassName" wrapperClassName="wrapperClassName" editorClassName="editorClassName" onEditorStateChange={this.onEditorStateChangeQ} />
      {/* <textarea disabled="disabled" value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}/> */}

      <Grid
        container
        direction={"row"}
        justify={"space-around"}
        alignItems={"center"}
      >
        <ItemGrid xs={12} sm={6} md={5} xl={4}>

          <Editor editorState={editorState1} toolbar={{
            image: {
              uploadCallback: this.uploadCallback1,
              previewImage: true
            }
          }} toolbarClassName="toolbarClassName" wrapperClassName="wrapperClassName" editorClassName="editorClassName" onEditorStateChange={this.onEditorStateChange1} />            </ItemGrid>
        <ItemGrid xs={12} sm={6} md={5} xl={4}>
          <Editor editorState={editorState2} toolbar={{
            image: {
              uploadCallback: this.uploadCallback2,
              previewImage: true
            }
          }} toolbarClassName="toolbarClassName" wrapperClassName="wrapperClassName" editorClassName="editorClassName" onEditorStateChange={this.onEditorStateChange2} />
        </ItemGrid>
      </Grid>

      <Grid
        container
        direction={"row"}
        justify={"space-around"}
        alignItems={"center"}
      >
        <ItemGrid xs={12} sm={6} md={5} xl={4}>

          <Editor editorState={editorState3} toolbar={{
            image: {
              uploadCallback: this.uploadCallback3,
              previewImage: true
            }
          }} toolbarClassName="toolbarClassName" wrapperClassName="wrapperClassName" editorClassName="editorClassName" onEditorStateChange={this.onEditorStateChange3} />            </ItemGrid>
        <ItemGrid xs={12} sm={6} md={5} xl={4}>
          <Editor editorState={editorState4} toolbar={{
            image: {
              uploadCallback: this.uploadCallback4,
              previewImage: true
            }
          }} toolbarClassName="toolbarClassName" wrapperClassName="wrapperClassName" editorClassName="editorClassName" onEditorStateChange={this.onEditorStateChange4} />
        </ItemGrid>
      </Grid>
      <Grid item="item" xs={12} style={{
        display: "flex"
      }} alignItems="center" direction="row" justify="center">
        {stockSubmitBtn}
      </Grid>
    </div>)
  }
  onContentStateChange = (contentState) => {
    this.setState({ contentState });
  };
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
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard cardTitle="Add new Question" cardSubtitle="This question will be added into question bank automatically" headerColor="blue" content={this.getCardContent()} />
        </ItemGrid>
      </Grid>
    </Fragment>);
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onClearToast: () => dispatch(actions.notifyClear())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dashboardStyle)(AddQues));
