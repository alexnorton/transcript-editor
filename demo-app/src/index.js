import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import 'whatwg-fetch';

import 'bootswatch/simplex/bootstrap.css';

import App from './components/App';
import EditorView from './components/EditorView';

import './css/index.css';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route component={App}>
      <Route path="/" component={EditorView} />
    </Route>
  </Router>,
  document.getElementById('root')
);
