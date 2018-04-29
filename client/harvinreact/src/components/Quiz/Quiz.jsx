import React ,{Component}from 'react';
import { withStyles, Button } from 'material-ui';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Editor from 'draft-js-plugins-editor';
import {EditorState} from 'draft-js';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css'
import createHighlightPlugin from '../draft-highlight-plugin/highlightPlugin';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';



const emojiPlugin = createEmojiPlugin();
const highlightPlugin = createHighlightPlugin();
const toolbarPlugin = createToolbarPlugin();



const { Toolbar } = toolbarPlugin;
const { EmojiSuggestions } = emojiPlugin;

class Quiz extends Component{
    constructor(props) {
        super(props);
        this.state = {
          editorState: EditorState.createEmpty(),
        }
      }
    
      onChange = (editorState) => {
        this.setState({
          editorState,
        });
      }
    
      render() {
        return (
          <div>
          <Editor style={{height:'100%',width:'1000px'}}
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={[highlightPlugin,toolbarPlugin, emojiPlugin]}
            />
          <EmojiSuggestions/>
          <Toolbar />

          </div>
        );
      }
}
Quiz.PropTypes={
    quiz:PropTypes.object.isRequired,
}

export default Quiz