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
        <Col xs={2} contentEditable={false}>{this.props.block.data.get('speaker')}</Col>
        <Col xs={10}>
          <EditorBlock {...this.props} />
        </Col>
      </Row>
    );
  }
}

export default TranscriptEditorBlock;
