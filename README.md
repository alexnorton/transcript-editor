# transcript-editor

[![Build Status](https://travis-ci.org/bbc/transcript-editor.svg?branch=master)](https://travis-ci.org/bbc/transcript-editor) [![npm](https://img.shields.io/npm/v/transcript-editor.svg)](https://www.npmjs.com/package/transcript-editor)

Transcript editor, implemented as a React component. Allows correction of errors in Speech to Text engine while maintaining word-level timing information. Built using [Draft.js](https://facebook.github.io/draft-js/).

Uses the [transcript-model](https://github.com/bbc/transcript-model) transcript representation format.

## ⚠️ Warning ⚠️

This project is very much pre-alpha. The edge-case handling, test coverage and general code quality all leave a lot to be desired. Any contributions, suggestions or comments are very welcome.

Some things I'd like to work on:

- Improving test coverage
- Refactoring horrible logic spaghetti code
- Presenting a better API
- Improving performance
- Fixing bugs

## Demo

Visit the [demo](https://bbc.github.io/transcript-editor/).

## Usage

### Basic example

```js
import React from 'react';
import TranscriptEditor from 'transcript-editor';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    // Get a Transcript from somewhere, e.g. from props, and add it to state
    this.state = { 
      initialTranscript: props.transcript,
    };
  }

  render() {
    return (
      <TranscriptEditor
        transcript={this.state.initialTranscript}
        onTranscriptUpdate={(transcript) => { console.log('transcript updated', transcript); }}
      />
    );
  }
};

export default MyComponent;
```

For a more complex example see the [demo application source code](demo-app/) in this repository.

### Props

| name                 | type       | description |
| -------------------- | ---------- | ----------- |
| `transcript`         | Transcript | Transcript object to hydrate the editor state from. |
| `disabled`           | boolean    | When true, user input is disabled. Defaults to false. |
| `onTranscriptUpdate` | function   | Callback to be exectuted when the transcript has changed. |
| `onSelectionChange`  | function   | Callback to be executed when the selection state has changed. |
| `onKeyboardEvent`    | function   | Callback to be executed when a keyboard event occurs. |
| `showSpeakers`       | boolean    | When true, show speaker information column. Defaults to false |

## Author

[**Alex Norton**](https://github.com/alexnorton/) - get in touch [@alxnorton](https://twitter.com/alxnorton)
