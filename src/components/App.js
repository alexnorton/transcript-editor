import React, { Component } from 'react';
import { PageHeader } from 'react-bootstrap';
import 'whatwg-fetch';

import jss from 'jss-browserify';

import EditorView from './EditorView';

class App extends Component {
  render() {
    return (
      <div>
        <PageHeader>Transcriptor</PageHeader>
        <EditorView />
      </div>
    );
  }
}

jss.set('body', {
  'background-color': 'pink',
});

export default App;
