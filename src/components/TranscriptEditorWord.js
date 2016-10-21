import React from 'react';
import { Entity } from 'draft-js';

const TranscriptEditorWord = ({ entityKey, children }) => {
  const entity = Entity.get(entityKey);
  const titleString = `${entity.data.start.toFixed(2)}`
    + ` - ${entity.data.end.toFixed(2)}`;
  return (
    <span
      title={titleString}
      id={`word-${entity.data.id}`}
      data-start={entity.data.start}
      data-end={entity.data.end}
      className="transcript-editor-block__word"
    >{ children }</span>
  );
};

TranscriptEditorWord.propTypes = {
  entityKey: React.PropTypes.string,
  children: React.PropTypes.array,
};

export default TranscriptEditorWord;
