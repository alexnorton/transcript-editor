import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Immutable from 'immutable';
import installDevTools from 'immutable-devtools';
import './css/index.css';

installDevTools(Immutable);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
