import React, { Component } from 'react';
import { EditorBlock } from 'draft-js';
import { Row, Col } from 'react-bootstrap';

class TranscriptEditorBlock extends Component {
  hello() {
    return 'blah';
  }

  render() {
    return (
      <Row>
        <Col
          xs={3}
          contentEditable={false}
          style={{
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
          }}
        >
          Speaker {this.props.block.data.get('speaker')}
        </Col>
        <Col xs={9}>
          <EditorBlock {...this.props} />
        </Col>
      </Row>
    );
  }
}

TranscriptEditorBlock.propTypes = {
  block: React.PropTypes.object,
};

export default TranscriptEditorBlock;
