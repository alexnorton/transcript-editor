import React from 'react';
import PropTypes from 'prop-types';

const TranscriptEditorSpace = ({ offsetKey, children }) => (
  <span
    id={`space-${offsetKey}`}
    className="transcript-editor-block__space"
  >{ children }</span>
);

TranscriptEditorSpace.propTypes = {
  offsetKey: PropTypes.string,
  children: PropTypes.array,
};

export default TranscriptEditorSpace;