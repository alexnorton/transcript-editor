import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import 'whatwg-fetch';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import App from './components/App';
import EditorView from './components/EditorView';
import VideoList from './components/VideoList';

import './css/index.css';

window.apiEndpoint = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001'
  : 'https://d3kepzbjvmq06q.cloudfront.net';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route component={App}>
      <Route path="/" component={VideoList} />
      <Route path="/:videoId" component={EditorView} />
    </Route>
  </Router>,
  document.getElementById('root')
);
