import React, { Component } from 'react';
import { withStyles, Button } from 'material-ui';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import Draft, { EditorState, RichUtils, convertFromRaw } from 'draft-js';
import createImagePlugin from 'draft-js-image-plugin';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import 'draft-js-image-plugin/lib/plugin.css';
import editorStyles from './editorStyles.css';
import alignmentToolStyles from './alignmentToolStyles.css';
import buttonStyles from './buttonStyles.css';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createDragNDropUploadPlugin from '@mikeljames/draft-js-drag-n-drop-upload-plugin';
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
import axios from 'axios'
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
  SubButton,
  SupButton
} from 'draft-js-buttons';

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin =
  createAlignmentPlugin({
    theme: {
      alignmentToolStyles,
      buttonStyles
    }
  });
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(resizeablePlugin.decorator, alignmentPlugin.decorator, focusPlugin.decorator, blockDndPlugin.decorator);
const imagePlugin = createImagePlugin({ decorator });
const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: (obj) => { console.log('obj', obj) },
  addImage: imagePlugin.addImage,
});
const toolbarPlugin = createToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    SubButton,
    SupButton,
    CodeButton,
    Separator,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton
  ]
});

const { Toolbar } = toolbarPlugin;





class AddQues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      questions: []
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:3001/admin/questions')
      .then(res => {
        let questions = res.data.questions
        console.log('questions', questions[0].question);
        this.setState({ questions: questions })
      })
      .catch(err => console.log('err', err))
  }

  onChange = (editorState) => {
    this.setState({ editorState });
  }

  focus = () => {
    this.editor.focus();
  };
  getAlignmentTool = () => {
    console.log('type', typeof AlignmentTool)
    return withStyles(alignmentToolStyles)(AlignmentTool)
  }

  onSubmit = (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('question', JSON.stringify(Draft.convertToRaw(this.state.editorState.getCurrentContent())))
    axios.post('http://localhost:3001/admin/questions', formData)
      .then(res => console.log('res', res))
      .catch(err => console.log('err', err))
  }

  render() {
    return (<div>
      <h3>Add new Question</h3>
      <div className={editorStyles.editor} onClick={this.focus} style={{ backgroundColor: 'white', minHeight: 200, padding: 20 }}>
        <Editor
          ref={(element) => { this.editor = element; }}

          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={[
            toolbarPlugin,
            blockDndPlugin,
            focusPlugin,
            alignmentPlugin,
            resizeablePlugin,
            imagePlugin,
            dragNDropFileUploadPlugin
          ]}
          customStyleMap={{
            SUBSCRIPT: {
              fontSize: '0.7em',
              verticalAlign: 'sub'
            },
            SUPERSCRIPT: {
              fontSize: '0.7em',
              verticalAlign: 'super'
            }
          }}
        />
      </div>
      <Toolbar />
      {/*<AlignmentTool/>*/}
      <Button variant="raised" color="primary" onClick={this.onSubmit}>
        Submit
      </Button>
      <hr />
      <br />
      <hr />
      <h3>Previously added question</h3>
      {this.state.questions.map(ques => {
        return <Editor editorState={Draft.EditorState.createWithContent(Draft.convertFromRaw(JSON.parse(ques.question)))} readOnly={true} />
      }
      )}
    </div>);
  }
}

export default AddQues
