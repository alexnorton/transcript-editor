import React from 'react';
import PropTypes from 'prop-types';

const TranscriptEditorSpanPlayed = ({ children }) => (
  <span className="transcript-editor-span transcript-editor-span__played">
    {children}
  </span>
);

TranscriptEditorSpanPlayed.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TranscriptEditorSpanPlayed;
