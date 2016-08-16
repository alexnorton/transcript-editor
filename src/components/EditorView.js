import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { AutoAffix } from 'react-overlays';

import VideoPlayer from './VideoPlayer';
import TranscriptEditor from './TranscriptEditor';

class EditorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transcript: {},
      playing: false,
      currentTime: 0,
    };

    this.onTimeUpdate = this.onTimeUpdate.bind(this);
  }

  componentDidMount() {
    fetch('data/105-5018361.json')
      .then(response => response.json())
      .then(json => {
        this.setState({ transcript: json });
      });
  }

  onTimeUpdate(time) {
    this.setState({
      currentTime: time,
    });
  }

  render() {
    return (
      <Row>
        <Col sm={6}>
          <AutoAffix
            viewportOffsetTop={10}
          >
            <div>
              <VideoPlayer onTimeUpdate={this.onTimeUpdate} />
              Current time: <code>{this.state.currentTime.toFixed(4)}</code>
            </div>
          </AutoAffix>
        </Col>
        <Col sm={6}>
          <TranscriptEditor
            currentTime={this.state.currentTime}
            transcript={this.state.transcript}
          />
        </Col>
      </Row>
    );
  }
}

export default EditorView;
