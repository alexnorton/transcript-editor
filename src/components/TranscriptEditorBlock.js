import React, { Component } from 'react';
import { EditorBlock } from 'draft-js';

class TranscriptEditorBlock extends Component {
  render() {
    return (
      <div className="transcript-editor-block">
        <div className="transcript-editor-block__speaker"
          contentEditable={false}
          style={{
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
          }}
        >
          Speaker {this.props.block.data.get('speaker')}
        </div>
        <div className="transcript-editor-block__text">
          <EditorBlock {...this.props} />
        </div>
      </div>
    );
  }
}

TranscriptEditorBlock.propTypes = {
  block: React.PropTypes.object,
};

export default TranscriptEditorBlock;
