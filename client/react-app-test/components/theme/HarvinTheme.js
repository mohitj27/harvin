import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Button from 'material-ui/Button';

const HarvinTheme = createMuiTheme({
  overrides: {
    MuiButton: {
      // Name of the styleSheet
      root: {
        // Name of the rule
        background: '#93E192',
        background: '-webkit-linear-gradient(to left, #11cf9f, #93E192)',
        background: 'linear-gradient(-45deg, #11cf9f, #93E192)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)',
      },
    },
  },
});

export default HarvinTheme;
