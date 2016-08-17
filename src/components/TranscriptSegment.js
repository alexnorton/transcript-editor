import React, { Component } from 'react';
import TranscriptWord from './TranscriptWord';

class TranscriptSegment extends Component {
  shouldComponentUpdate() {
    return this.props.played;
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
  played: React.PropTypes.bool,
};

export default TranscriptSegment;
