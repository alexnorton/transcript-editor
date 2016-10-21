import React from 'react';
import { EditorBlock } from 'draft-js';

const TranscriptEditorBlock = props => (
  <div className="transcript-editor-block">
    <div
      className="transcript-editor-block__speaker"
      contentEditable={false}
      style={{
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      Speaker {props.block.data.get('speaker')}
    </div>
    <div className="transcript-editor-block__text">
      <EditorBlock {...props} />
    </div>
  </div>
);

TranscriptEditorBlock.propTypes = {
  block: React.PropTypes.object,
};

export default TranscriptEditorBlock;
