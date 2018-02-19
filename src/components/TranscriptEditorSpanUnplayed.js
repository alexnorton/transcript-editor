import React from 'react';
import PropTypes from 'prop-types';

const TranscriptEditorSpanUnplayed = ({ children }) => (
  <span className="transcript-editor-span transcript-editor-span__unplayed">
    {children}
  </span>
);

TranscriptEditorSpanUnplayed.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TranscriptEditorSpanUnplayed;
