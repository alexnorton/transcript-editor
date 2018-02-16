import React from 'react';
import ReactDOM from 'react-dom';

import EditorView from './components/EditorView';

import './index.css';

ReactDOM.render(
  <div className="container">
    <h1>Transcript Editor</h1>
    <EditorView />
  </div>,
  document.getElementById('root'),
);
