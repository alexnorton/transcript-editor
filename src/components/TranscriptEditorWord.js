import React from 'react';
import { Entity } from 'draft-js';

const TranscriptEditorWord = ({ entityKey, children }) => {
  const entity = Entity.get(entityKey);
  const titleString = `${entity.data.start.toFixed(2)}`
    + ` - ${entity.data.end.toFixed(2)}`;
  return (
    <span
      title={titleString}
      style={{
        backgroundColor: '#d4eaff',
        border: '1px solid #ddd',
        padding: '0 2px',
      }}
    >{ children }</span>
  );
};

TranscriptEditorWord.propTypes = {
  entityKey: React.PropTypes.string,
  children: React.PropTypes.array,
};

export default TranscriptEditorWord;
