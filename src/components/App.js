import React, { Component } from 'react';
import { PageHeader } from 'react-bootstrap';
import 'whatwg-fetch';

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

export default App;
