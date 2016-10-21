import React from 'react';

const TranscriptEditorSpace = ({ offsetKey, children }) => (
  <span
    id={`space-${offsetKey}`}
    className="transcript-editor-block__space"
  >{ children }</span>
);

TranscriptEditorSpace.propTypes = {
  offsetKey: React.PropTypes.string,
  children: React.PropTypes.array,
};

export default TranscriptEditorSpace;
