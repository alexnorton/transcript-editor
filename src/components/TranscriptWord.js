import React, { Component } from 'react';

class TranscriptWord extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.played !== nextProps.played;
  }

  render() {
    return (
      <span>
        <span
          style={{
            backgroundColor: this.props.played ? '#ccc' : 'white',
          }}
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

export default TranscriptWord;
