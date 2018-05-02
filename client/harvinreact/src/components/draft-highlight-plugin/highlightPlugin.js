import  { RichUtils } from 'draft-js';

const defaultStyle = {
  verticalAlign:'sub',
  fontSize:'0.6em'
};

export default (style = {}) => {
  return {
    customStyleMap: {
      'HIGHLIGHT': {
        ...defaultStyle,
        ...style,
      },
    },
    keyBindingFn: (e) => {
      if (e.ctrlKey && e.key === 'q') {
        return 'highlight';
      }
    },
    handleKeyCommand: (command, editorState, { setEditorState }) => {
      if (command === 'highlight') {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
        return true;
      }
    },
  };
};
