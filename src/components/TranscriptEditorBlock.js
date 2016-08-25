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
          xs={2}
          contentEditable={false}
          style={{
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
          }}
        >
          {this.props.block.data.get('speaker')}
        </Col>
        <Col xs={10}>
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
