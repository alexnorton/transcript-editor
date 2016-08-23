import React, { Component } from 'react';
import { Entity } from 'draft-js';

class TranscriptEditorWord extends Component {
  static getId(entityKey) {
    return `word-${entityKey}`;
  }

  render() {
    const entity = Entity.get(this.props.entityKey);
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
        id={`word-${entity.data.uuid}`}
      >{ this.props.children }</span>
    );
  }

}

TranscriptEditorWord.propTypes = {
  entityKey: React.PropTypes.string,
  children: React.PropTypes.array,
};

export default TranscriptEditorWord;
