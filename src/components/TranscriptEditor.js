import React, { Component } from 'react';

const TranscriptEditor = ({ transcript, currentTime }) => {
  if (transcript.commaSegments) {
    return (
      <div>
        {transcript.commaSegments.segments.transcriptions.map((t, i) =>
          <TranscriptSegment
            transcript={t}
            currentTime={currentTime}
            key={i}
            segmentNumber={i}
            played={currentTime >= t.words[0].start}
          />
        )}
      </div>
    );
  }
  return null;
};

TranscriptEditor.propTypes = {
  transcript: React.PropTypes.object,
  currentTime: React.PropTypes.number,
};

class TranscriptSegment extends Component {
  shouldComponentUpdate(nextProps) {
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

class TranscriptWord extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.played !== nextProps.played;
  }

  onClick() {
    console.log(this.props.word);
    alert(this.props.word);
  }

  render() {
    return (
      <span>
        <span
          style={{
            backgroundColor: this.props.played ? '#ccc' : 'white',
          }}
          onClick={this.onClick}
        >
          {this.props.word.word}
        </span>
        {' '}
      </span>
    );
  }
}

TranscriptWord.propTypes = {
  word: React.PropTypes.object,
  played: React.PropTypes.bool,
};

export default TranscriptEditor;
