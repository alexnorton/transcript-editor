import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { AutoAffix } from 'react-overlays';

import VideoPlayer from './VideoPlayer';
import TranscriptEditor from './TranscriptEditor';
import StyleManager from '../StyleManager';
import Transcript from '../model/Transcript';

class EditorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transcript: null,
      initialTranscript: null,
      playing: false,
      currentTime: 0,
    };
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onTranscriptUpdate = this.onTranscriptUpdate.bind(this);
  }

  componentDidMount() {
    this.styleManager = new StyleManager();
    fetch(`${window.apiEndpoint}/${this.props.params.videoId}.json`)
      .then(response => response.json())
      .then(json => {
        this.setState({ initialTranscript: Transcript.fromComma(json) });
      });
  }

  onTimeUpdate(time) {
    this.styleManager.setTime(time);
  }

  onTranscriptUpdate(transcript) {
    this.styleManager.setTranscript(transcript);
  }

  render() {
    return (
      <Row>
        <Col xs={6}>
          <AutoAffix
            viewportOffsetTop={10}
          >
            <div>
              <VideoPlayer
                videoId={this.props.params.videoId}
                onTimeUpdate={this.onTimeUpdate}
              />
            </div>
          </AutoAffix>
        </Col>
        <Col xs={6}>
          <TranscriptEditor
            transcript={this.state.initialTranscript}
            onTranscriptUpdate={this.onTranscriptUpdate}
          />
        </Col>
      </Row>
    );
  }
}

EditorView.propTypes = {
  params: React.PropTypes.object,
};

export default EditorView;
