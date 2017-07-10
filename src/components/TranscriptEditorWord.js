import React from 'react';
import { ContentState } from 'draft-js';

const TranscriptEditorWord = ({ entityKey, children, contentState }) => {
  const entity = contentState.getEntity(entityKey);
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
  contentState: React.PropTypes.instanceOf(ContentState),
};

export default TranscriptEditorWord;
