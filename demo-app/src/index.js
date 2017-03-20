import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import { PageHeader } from 'react-bootstrap';

import 'bootswatch/simplex/bootstrap.css';

import EditorView from './components/EditorView';

import './css/index.css';

ReactDOM.render(
  <div>
    <PageHeader>Transcript Editor</PageHeader>
    <EditorView />
  </div>,
  document.getElementById('root')
);
