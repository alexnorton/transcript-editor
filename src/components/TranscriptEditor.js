import React, { Component } from 'react';
import { Editor, EditorState, ContentState, ContentBlock, CharacterMetadata,
  Entity, CompositeDecorator } from 'draft-js';
import Immutable from 'immutable';

import TranscriptEditorWord from './TranscriptEditorWord';

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
        component: TranscriptEditorWord,
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
              'TRANSCRIPT_WORD', 'MUTABLE', w.toJS()
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
    const lastChangeType = editorState.getLastChangeType();
    if (lastChangeType === 'backspace-character' || lastChangeType === 'remove-range') {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const blockMap = contentState.getBlockMap();
      const newBlockMap = blockMap.map(contentBlock => {
        if (contentBlock.getKey() === selectionState.getAnchorKey()) {
          return contentBlock.set(
            'characterList', this.mergeAdjacentWordEntities(contentBlock.characterList)
          );
        }
        return contentBlock;
      });
      const newContentState = contentState.set('blockMap', newBlockMap);
      const newEditorState = EditorState.push(editorState, newContentState, 'apply-entity', true);
      this.setState({
        editorState: EditorState.acceptSelection(newEditorState, selectionState),
      });
    } else {
      this.setState({
        editorState,
      });
    }
  }

  handleReturn() {
    return true;
  }

  mergeAdjacentWordEntities(characterList) {
    return characterList.reduce((newList, character) => {
      // Is this the first character?
      if (!newList.isEmpty()) {
        const previousCharacter = newList.last();
        // Does the previous character have a different entity?
        if (character.entity !== previousCharacter.entity) {
          const entity = Entity.get(character.entity);
          const previousEntity = Entity.get(previousCharacter.entity);
          // Does the different entity have the same type?
          if (entity.type === previousEntity.type && entity !== previousEntity) {
            // Merge the entities
            Entity.mergeData(previousCharacter.entity, { end: entity.data.end });
            return newList.push(CharacterMetadata.applyEntity(character, previousCharacter.entity));
          }
        }
      }
      return newList.push(character);
    }, new Immutable.List());
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="TranscriptEditor">
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          handleReturn={this.handleReturn}
        />
      </div>
    );
  }
}

TranscriptEditor.propTypes = {
  transcript: React.PropTypes.object,
};

export default TranscriptEditor;
