import React from 'react';
import { EditorBlock } from 'draft-js';

const TranscriptEditorBlock = (props) => {
  const speakerSection = props.blockProps.showSpeakers ? (
    <div
      className="transcript-editor-block__speaker"
      contentEditable={false}
      style={{
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      Speaker {props.block.data.get('speaker') + 1}
    </div>
  ) : null;

  return (
    <div className="transcript-editor-block">
      {speakerSection}
      <div className="transcript-editor-block__text">
        <EditorBlock {...props} />
      </div>
    </div>
  );
};

TranscriptEditorBlock.propTypes = {
  block: React.PropTypes.node,
  blockProps: React.PropTypes.shape({
    showSpeakers: React.PropTypes.bool,
  }),
};

export default TranscriptEditorBlock;
