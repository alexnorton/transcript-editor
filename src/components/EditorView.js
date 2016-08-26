import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { AutoAffix } from 'react-overlays';
import Immutable from 'immutable';

import VideoPlayer from './VideoPlayer';
import TranscriptEditor from './TranscriptEditor';
import StyleManager from '../StyleManager';

class EditorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transcript: {},
      playing: false,
      currentTime: 0,
    };
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onEntityUpdate = this.onEntityUpdate.bind(this);
  }

  componentDidMount() {
    this.styleManager = new StyleManager();
    fetch(`data/${this.props.params.videoId}.json`)
      .then(response => response.json())
      .then(json => {
        this.setState({ transcript: this.transformTranscript(json) });
      });
  }

  onTimeUpdate(time) {
    this.styleManager.setTime(time);
  }

  onEntityUpdate(entities) {
    this.styleManager.setEntities(entities);
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
