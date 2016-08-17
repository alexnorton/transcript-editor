import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { AutoAffix } from 'react-overlays';
import Immutable from 'immutable';

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
        this.setState({ transcript: this.transformTranscript(json) });
      });
  }

  onTimeUpdate(time) {
    this.setState({
      currentTime: time,
    });
  }

  transformTranscript(json) {
    const speakers = new Immutable.Map(
      json.commaSegments.segmentation.speakers.map(s =>
        [
          s['@id'],
          new Immutable.Map({
            name: null,
          }),
        ]
      )
    );

    const segments = new Immutable.List(
      json.commaSegments.segmentation.segments.map((s, i) =>
        new Immutable.Map({
          speaker: s.speaker['@id'],
          words: new Immutable.List(
            json.commaSegments.segments.transcriptions[i].words.map(w =>
              new Immutable.Map({
                word: w.punct,
                start: w.start,
                end: w.end,
              })
            )
          ),
        })
      )
    );

    return new Immutable.Map({ speakers, segments });
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
