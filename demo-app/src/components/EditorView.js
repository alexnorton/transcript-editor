import React, { Component } from 'react';
import { Row, Col, Button, ButtonToolbar } from 'react-bootstrap';
import { AutoAffix } from 'react-overlays';
import { saveAs } from 'file-saver';
import TranscriptEditor from 'transcript-editor';
import { Transcript } from 'transcript-model';

import 'transcript-editor/lib/style.css';

import VideoPlayer from './VideoPlayer';
import StyleManager from '../StyleManager';

class EditorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clipName: null,
      initialTranscript: null,
      playing: false,
      currentTime: 0,
    };
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onTranscriptUpdate = this.onTranscriptUpdate.bind(this);
    this.loadTranscript = this.loadTranscript.bind(this);
    this.handleLoadTranscript = this.handleLoadTranscript.bind(this);
    this.saveTranscript = this.saveTranscript.bind(this);
  }

  componentDidMount() {
    this.styleManager = new StyleManager();
    fetch(`${process.env.PUBLIC_URL}/media-tagger.json`)
      .then(response => response.json())
      .then((json) => {
        const transcript = Transcript.fromMediaTagger(json);
        this.setState({
          initialTranscript: transcript,
          clipName: json.metadata.RETURN.RESULTS.ITEM.CLIPNAME,
        });
        this.transcript = transcript;
        this.editor.focus();
      });
  }

  onTimeUpdate(time) {
    this.styleManager.setTime(time);
  }

  onTranscriptUpdate(transcript) {
    this.styleManager.setTranscript(transcript);
    this.transcript = transcript;
  }

  loadTranscript() {
    this.fileInput.click();
  }

  handleLoadTranscript() {
    const file = this.fileInput.files[0];
    this.fileInput.value = '';

    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const transcriptJSONString = event.target.result;
      const transcriptJSON = JSON.parse(transcriptJSONString);
      const transcript = Transcript.fromJSON(transcriptJSON);
      this.setState({
        initialTranscript: transcript,
      });
      this.transcript = transcript;
    };

    fileReader.readAsText(file);
  }

  handleKeyboardEvent(keyboardEvent) {
    if (keyboardEvent.ctrlKey) {
      if (keyboardEvent.key === ' ') {
        console.log('play/pause');
        keyboardEvent.preventDefault();
        return;
      }
      if (keyboardEvent.key === 'f') {
        console.log('forwards');
        keyboardEvent.preventDefault();
        return;
      }
      if (keyboardEvent.key === 'b') {
        console.log('backwards');
        keyboardEvent.preventDefault();
        return;
      }
    }
  }

  saveTranscript() {
    const blob = new Blob(
      [JSON.stringify(this.transcript.toJSON(), null, 2)],
      { type: 'application/json;charset=utf-8' }
    );
    saveAs(blob, 'transcript.json');
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={12}>
            <h2 style={{ marginTop: 0 }}>{ this.state.clipName }</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={5}>
            <AutoAffix
              viewportOffsetTop={10}
            >
              <div>
                <VideoPlayer
                  src={`${process.env.PUBLIC_URL}/video.mp4`}
                  onTimeUpdate={this.onTimeUpdate}
                />
                <ButtonToolbar>
                  <input
                    type="file"
                    ref={(c) => { this.fileInput = c; }}
                    style={{ display: 'none' }}
                    onChange={this.handleLoadTranscript}
                  />
                  <Button onClick={this.loadTranscript}>Load transcript</Button>
                  <Button onClick={this.saveTranscript}>Save transcript</Button>
                  <Button onClick={() => { this.editor.focus(); }}>Focus editor</Button>
                </ButtonToolbar>
              </div>
            </AutoAffix>
          </Col>
          <Col xs={7}>
            <TranscriptEditor
              ref={(editor) => { this.editor = editor; }}
              transcript={this.state.initialTranscript}
              onTranscriptUpdate={this.onTranscriptUpdate}
              onKeyboardEvent={this.handleKeyboardEvent}
              showSpeakers
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default EditorView;
