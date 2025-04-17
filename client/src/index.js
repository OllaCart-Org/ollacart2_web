import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';  // Custom styles
import './globals.css';  // From the Next.js project
import './styles/main.css';  // From the Next.js project
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
