# transcript-editor

[![Build Status](https://travis-ci.org/bbc/transcript-editor.svg?branch=master)](https://travis-ci.org/bbc/transcript-editor) [![npm](https://img.shields.io/npm/v/transcript-editor.svg)](https://www.npmjs.com/package/transcript-editor)

Editor component for timed transcripts. Allows correction of errors produced by the speech recognition process while maintaining word-level timing information.

Built using [Draft.js](https://facebook.github.io/draft-js/).

Uses the [transcript-model](https://github.com/bbc/transcript-model) transcript representation format.

## Usage

### Props

| name                 | type       | description |
| -------------------- | ---------- | ----------- |
| `transcript`         | Transcript | Transcript object to hydrate the editor state from. |
| `disabled`           | boolean    | When true, user input is disabled. Defaults to false. |
| `onTranscriptUpdate` | function   | Callback to be exectuted when the transcript has changed. |
| `onSelectionChange`  | function   | Callback to be executed when the selection state has changed. |
| `onKeyboardEvent`    | function   | Callback to be executed when a keyboard event occurs. |
| `showSpeakers`       | boolean    | When true, show speaker information column. Defaults to false |
