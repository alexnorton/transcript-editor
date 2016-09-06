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
      playing: false,
      currentTime: 0,
    };
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onEntityUpdate = this.onEntityUpdate.bind(this);
  }

  componentDidMount() {
    this.styleManager = new StyleManager();
    fetch(`${window.apiEndpoint}/${this.props.params.videoId}.json`)
      .then(response => response.json())
      .then(json => {
        this.setState({ transcript: Transcript.fromComma(json) });
      });
  }

  onTimeUpdate(time) {
    this.styleManager.setTime(time);
  }

  onEntityUpdate(entities) {
    this.styleManager.setEntities(entities);
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
            transcript={this.state.transcript}
            onEntityUpdate={this.onEntityUpdate}
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
