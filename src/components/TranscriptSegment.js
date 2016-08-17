import React, { Component } from 'react';
import TranscriptWord from './TranscriptWord';

class TranscriptSegment extends Component {
  shouldComponentUpdate(nextProps) {
    return (nextProps.startedPlaying && !nextProps.finishedPlaying)  // currently playing
      || (this.props.finishedPlaying !== nextProps.finishedPlaying); // finished playing
  }

  render() {
    return (
      <p>
        {this.props.transcript.words.map((w, i) => (
          <TranscriptWord
            word={w}
            played={this.props.currentTime >= w.start}
            key={`${this.props.segmentNumber}-${i}`}
          />
        ))}
      </p>
    );
  }
}

TranscriptSegment.propTypes = {
  transcript: React.PropTypes.object,
  currentTime: React.PropTypes.number,
  segmentNumber: React.PropTypes.number,
  startedPlaying: React.PropTypes.bool,
  finishedPlaying: React.PropTypes.bool,
};

export default TranscriptSegment;
