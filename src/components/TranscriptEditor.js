import React, { Component } from 'react';
import { Editor, EditorState, ContentState, ContentBlock, CharacterMetadata,
  Entity, CompositeDecorator } from 'draft-js';
import Immutable from 'immutable';

import '../css/TranscriptEditor.css';

class TranscriptEditor extends Component {
  constructor(props) {
    super(props);

    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = this.onChange.bind(this);

    this.decorator = new CompositeDecorator([
      {
        strategy: (contentBlock, callback) => {
          contentBlock.findEntityRanges((character) => {
            const entityKey = character.getEntity();
            if (entityKey === null) {
              return false;
            }
            return Entity.get(entityKey).getType() === 'TRANSCRIPT_WORD';
          }, callback);
        },
        component: (cprops) => (
          <span style={{ backgroundColor: '#eee', margin: '5px 0' }}>{ cprops.children }</span>
        ),
      },
    ]);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.transcript !== nextProps.transcript) {
      const transcript = nextProps.transcript;

      const contentBlocks = transcript.get('segments').map((s, i) =>
        new ContentBlock({
          key: i.toString(),
          characterList: s.get('words').map(w => {
            const entity = Entity.create(
              'TRANSCRIPT_WORD', 'MUTABLE', w
            );
            return new Immutable.List(w.get('word').split('').map(() =>
              CharacterMetadata.applyEntity(
                CharacterMetadata.create(),
                entity
              )
            ));
          }).interpose(
            new Immutable.List([
              CharacterMetadata.applyEntity(
                CharacterMetadata.create(),
                Entity.create(
                  'TRANSCRIPT_SPACE', 'IMMUTABLE', null
                )
              ),
            ])
          ).flatten(1),
          text: s.get('words').map(w =>
            w.get('word')
          ).join(' '),
          data: s,
        })
      );

      this.setState({
        editorState: EditorState.createWithContent(
          ContentState.createFromBlockArray(contentBlocks),
          this.decorator
        ),
      });
    }
  }

  onChange(editorState) {
    // console.log(editorState);
    this.setState({ editorState });
  }


  handleKeyCommand(command) {
    // console.log(command);
    return 'not-handled';
  }


  render() {
    const { editorState } = this.state;
    return (
      <div className="TranscriptEditor">
        <Editor
          editorState={editorState}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

TranscriptEditor.propTypes = {
  transcript: React.PropTypes.object,
};

export default TranscriptEditor;
