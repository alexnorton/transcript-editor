import React from 'react';
import { ContentState } from 'draft-js';
import PropTypes from 'prop-types';

const TranscriptEditorWord = ({ entityKey, children, contentState }) => {
  const entity = contentState.getEntity(entityKey);
  const titleString = `${entity.data.start.toFixed(2)} - ${entity.data.end.toFixed(2)}`;
  return (
    <span
      title={titleString}
      data-start={entity.data.start}
      data-end={entity.data.end}
      className="transcript-editor-entity__word"
    >
      {children}
    </span>
  );
};

TranscriptEditorWord.propTypes = {
  entityKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  contentState: PropTypes.instanceOf(ContentState).isRequired,
};

export default TranscriptEditorWord;
