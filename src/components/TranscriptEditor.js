import React from 'react';
import TranscriptSegment from './TranscriptSegment';

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

export default TranscriptEditor;
