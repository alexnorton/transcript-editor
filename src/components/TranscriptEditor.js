import React, { Component } from 'react';
import { Editor, EditorState, ContentState, ContentBlock, CharacterMetadata,
  Entity, CompositeDecorator, convertToRaw } from 'draft-js';
import Immutable from 'immutable';
import uuid from 'node-uuid';
import debounce from 'lodash.debounce';

import TranscriptEditorBlock from './TranscriptEditorBlock';
import TranscriptEditorWord from './TranscriptEditorWord';

import '../css/TranscriptEditor.css';

class TranscriptEditor extends Component {
  constructor(props) {
    super(props);

    this.state = { editorState: EditorState.createEmpty() };

    this.onChange = this.onChange.bind(this);
    this.handleBeforeInput = this.handleBeforeInput.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.blockRenderer = this.blockRenderer.bind(this);

    this.debouncedSendEntityUpdate = debounce(this.sendEntityUpdate, 500);

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
              'TRANSCRIPT_WORD',
              'MUTABLE',
              { start: w.get('start'), end: w.get('end'), uuid: uuid.v4() }
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
          data: new Immutable.Map({ speaker: s.get('speaker') }),
        })
      );

      const contentState = ContentState.createFromBlockArray(contentBlocks);

      this.sendEntityUpdate(contentState);

      this.setState({
        editorState: EditorState.createWithContent(
          contentState,
          this.decorator
        ),
      });
    }
  }

  onChange(editorState) {
    const contentState = editorState.getCurrentContent();
    if (contentState !== this.state.editorState.getCurrentContent()) {
      this.debouncedSendEntityUpdate(contentState);
      const selectionState = editorState.getSelection();
      const blockMap = contentState.getBlockMap();

      const newBlockMap = blockMap.reduce((_newBlockMap, contentBlock, blockKey) => {
        let newContentBlock = contentBlock;

        // Is this the block currently being edited?
        if (blockKey === selectionState.getAnchorKey()) {
          // Update the entities
          newContentBlock = contentBlock.set(
            'characterList', this.updateEntities(contentBlock.characterList)
          );

          // Is this block missing data? (e.g. it's been split)
          if (newContentBlock.data.isEmpty()) {
            // Copy the previous block's data
            newContentBlock = newContentBlock.set(
              'data', _newBlockMap.last().get('data')
            );
          }

          return _newBlockMap.set(blockKey, newContentBlock);
        }

        return _newBlockMap.set(blockKey, contentBlock);
      }, new Immutable.OrderedMap());

      const newContentState = contentState.set('blockMap', newBlockMap);
      const newEditorState = EditorState.push(editorState, newContentState, 'apply-entity', true);
      return this.setState({
        editorState: EditorState.acceptSelection(newEditorState, selectionState),
      });
    }
    return this.setState({
      editorState,
    });
  }

  handleBeforeInput(chars) {
    // Don't allow inserting additional spaces between words
    if (chars === ' ') {
      const editorState = this.state.editorState;
      const selectionState = editorState.getSelection();
      const startKey = selectionState.getStartKey();
      const startOffset = selectionState.getStartOffset();
      const selectedBlock = editorState.getCurrentContent().getBlockForKey(startKey);
      const entityKeyBefore = selectedBlock.getEntityAt(startOffset - 1);
      if (entityKeyBefore && Entity.get(entityKeyBefore).type === 'TRANSCRIPT_SPACE') {
        return true;
      }
    }
    return false;
  }

  blockRenderer() {
    return {
      component: TranscriptEditorBlock,
    };
  }

  sendEntityUpdate(contentState) {
    this.props.onEntityUpdate(convertToRaw(contentState).entityMap);
  }

  handleReturn() {
    const editorState = this.state.editorState;
    const selectionState = editorState.getSelection();
    const startKey = selectionState.getStartKey();
    const startOffset = selectionState.getStartOffset();
    const selectedBlock = editorState.getCurrentContent().getBlockForKey(startKey);
    const entityKeyBefore = selectedBlock.getEntityAt(startOffset - 1);
    const entityKeyAfter = selectedBlock.getEntityAt(startOffset);
    if ((entityKeyBefore && Entity.get(entityKeyBefore).type === 'TRANSCRIPT_SPACE')
      || (entityKeyAfter && Entity.get(entityKeyAfter).type === 'TRANSCRIPT_SPACE')) {
      return false;
    }
    return true;
  }

  handlePastedText() {
    return true;
  }

  updateEntities(characterList) {
    return characterList.reduce((newList, character) => {
      // Is this the first character?
      if (newList.isEmpty()) {
        // Is this a space?
        if (character.entity && Entity.get(character.entity).type === 'TRANSCRIPT_SPACE') {
          return newList;
        }
      } else {
        const previousCharacter = newList.last();
        // Does the previous character have an entity?
        if (previousCharacter.entity) {
          // Does the previous character have a different entity?
          if (character.entity && previousCharacter.entity
            && character.entity !== previousCharacter.entity) {
            const entity = Entity.get(character.entity);
            const previousEntity = Entity.get(previousCharacter.entity);
            // Does the different entity have the same type?
            if (entity.type === previousEntity.type && entity !== previousEntity) {
              // Merge the entities
              Entity.mergeData(previousCharacter.entity, { end: entity.data.end });
              return newList.push(
                CharacterMetadata.applyEntity(character, previousCharacter.entity)
              );
            }
          }
        } else {
          // Set it to the entity of this character
          return newList
            .set(-1, CharacterMetadata.applyEntity(previousCharacter, character.entity))
            .push(character);
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
          handleBeforeInput={this.handleBeforeInput}
          handlePastedText={this.handlePastedText}
          blockRendererFn={this.blockRenderer}
        />
      </div>
    );
  }
}

TranscriptEditor.propTypes = {
  transcript: React.PropTypes.object,
  onEntityUpdate: React.PropTypes.func,
};

export default TranscriptEditor;
