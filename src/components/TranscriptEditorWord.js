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
        id={`word-${entity.data.id}`}
        data-start={entity.data.start}
        data-end={entity.data.end}
        className="transcript-editor-block__word"
      >{ this.props.children }</span>
    );
  }

}

TranscriptEditorWord.propTypes = {
  entityKey: React.PropTypes.string,
  children: React.PropTypes.array,
};

export default TranscriptEditorWord;
