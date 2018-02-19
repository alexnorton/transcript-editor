import React from 'react';
import PropTypes from 'prop-types';

const TranscriptEditorSpace = ({ children }) => (
  <span className="transcript-editor-entity__space">
    {children}
  </span>
);

TranscriptEditorSpace.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TranscriptEditorSpace;
