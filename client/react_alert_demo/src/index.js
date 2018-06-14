import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
ReactDOM.render(<AlertProvider>
    <App />
  </AlertProvider>, document.getElementById('root'));
registerServiceWorker();
