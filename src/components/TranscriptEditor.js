import React, { Component } from 'react';
import { Editor, EditorState, Entity, CompositeDecorator, CharacterMetadata } from 'draft-js';
import Immutable from 'immutable';
import debounce from 'lodash.debounce';

import convertFromTranscript from '../helpers/convertFromTranscript';
import convertToTranscript from '../helpers/convertToTranscript';
import updateBlock from '../helpers/updateBlock';
import TranscriptEditorBlock from './TranscriptEditorBlock';
import TranscriptEditorWord from './TranscriptEditorWord';
import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE, TRANSCRIPT_PLACEHOLDER }
  from '../helpers/TranscriptEntities';

import '../css/TranscriptEditor.css';

class TranscriptEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      speakers: [],
    };

    this.onChange = this.onChange.bind(this);
    this.handleBeforeInput = this.handleBeforeInput.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.blockRenderer = this.blockRenderer.bind(this);

    this.debouncedSendTranscriptUpdate = debounce(this.sendTranscriptUpdate, 500);

    this.decorator = new CompositeDecorator([
      {
        strategy: (contentBlock, callback) => {
          contentBlock.findEntityRanges((character) => {
            const entityKey = character.getEntity();
            if (entityKey === null) {
              return false;
            }
            const entityType = Entity.get(entityKey).getType();
            return entityType === TRANSCRIPT_WORD || entityType === TRANSCRIPT_PLACEHOLDER;
          }, callback);
        },
        component: TranscriptEditorWord,
      },
    ]);
  }

  componentWillReceiveProps(nextProps) {
    const transcript = nextProps.transcript;
    if (transcript && this.state.transcript !== transcript) {
      const { contentState, speakers } = convertFromTranscript(transcript);

      this.sendTranscriptUpdate(contentState, speakers);

      this.setState({
        editorState: EditorState.createWithContent(
          contentState,
          this.decorator
        ),
        speakers,
      });
    }
  }

  onChange(editorState) {
    const contentState = editorState.getCurrentContent();
    const previousEditorState = this.state.editorState;
    if (contentState !== previousEditorState.getCurrentContent()) {
      this.debouncedSendTranscriptUpdate(contentState, this.state.speakers);

      const selectionState = editorState.getSelection();
      const startKey = selectionState.getStartKey();
      const previousStartKey = previousEditorState.getSelection().getStartKey();

      const blockMap = contentState.getBlockMap();

      const newBlockMap = blockMap.reduce((_newBlockMap, contentBlock, blockKey) => {
        let newContentBlock = contentBlock;

        // Is this the block currently being edited?
        if (blockKey === startKey) {
          // Has everything been deleted from the block?
          if (newContentBlock.characterList.isEmpty()) {
            // Remove it
            return _newBlockMap;
          }

          const startOffset = selectionState.getStartOffset();
          // Have we merged blocks?
          if (blockMap.size < previousEditorState.getCurrentContent().getBlockMap().size) {
            // Do we have two adjacent words?
            if (Entity.get(newContentBlock.characterList.get(startOffset).entity).type
                  === TRANSCRIPT_WORD
             && Entity.get(newContentBlock.characterList.get(startOffset - 1).entity).type
                   === TRANSCRIPT_WORD) {
              // Add a space
              newContentBlock = newContentBlock
                .set('characterList', newContentBlock.characterList.insert(startOffset,
                  CharacterMetadata.applyEntity(
                    CharacterMetadata.create(),
                    Entity.create(
                      TRANSCRIPT_SPACE, 'IMMUTABLE', null
                    )
                  )
                ))
                .set('text', `${newContentBlock.text.slice(0, startOffset)}`
                           + ` ${newContentBlock.text.slice(startOffset)}`
                );
            }
          }

          // Update the entities
          newContentBlock = newContentBlock.merge(
            updateBlock(
              newContentBlock,
              previousEditorState.getCurrentContent().getBlockForKey(blockKey)
            )
          );

          // Have we created a leading space? (e.g. when splitting a block)
          if (Entity.get(
              newContentBlock.characterList.first().entity
            ).type === TRANSCRIPT_SPACE) {
            // Remove the leading space
            newContentBlock = newContentBlock
              .set('characterList', newContentBlock.characterList.shift())
              .set('text', newContentBlock.text.substring(1));
          }

          // Is this block missing data? (e.g. it's been split)
          if (newContentBlock.data.isEmpty()) {
            // Copy the previous block's data
            newContentBlock = newContentBlock.set(
              'data', _newBlockMap.last().data
            );
          }
        // Otherwise is this the block previously being edited? (e.g. that was split)
        } else if (blockKey === previousStartKey) {
          // Have we created a trailing space?
          if (Entity.get(
              newContentBlock.characterList.last().entity
            ).type === TRANSCRIPT_SPACE) {
            // Remove the trailing space
            newContentBlock = newContentBlock
              .set('characterList', newContentBlock.characterList.pop())
              .set('text', newContentBlock.text.substring(0, newContentBlock.text.length - 1));
          }
        }

        return _newBlockMap.set(blockKey, newContentBlock);
      }, new Immutable.OrderedMap());

      const newContentState = contentState.set('blockMap', newBlockMap);
      return this.setState({
        editorState: EditorState.push(
          previousEditorState, newContentState, editorState.getLastChangeType()
        ),
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
      if (entityKeyBefore && Entity.get(entityKeyBefore).type === TRANSCRIPT_SPACE) {
        return true;
      }
    }
    return false;
  }

  blockRenderer() {
    return {
      component: TranscriptEditorBlock,
      props: {
        speakers: this.state.speakers,
      },
    };
  }

  sendTranscriptUpdate(contentState, speakers) {
    this.props.onTranscriptUpdate(convertToTranscript(contentState, speakers));
  }

  handleReturn() {
    const editorState = this.state.editorState;
    const selectionState = editorState.getSelection();
    const startKey = selectionState.getStartKey();
    const startOffset = selectionState.getStartOffset();
    const selectedBlock = editorState.getCurrentContent().getBlockForKey(startKey);
    const entityKeyBefore = selectedBlock.getEntityAt(startOffset - 1);
    const entityKeyAfter = selectedBlock.getEntityAt(startOffset);
    if ((entityKeyBefore && Entity.get(entityKeyBefore).type === TRANSCRIPT_SPACE)
      || (entityKeyAfter && Entity.get(entityKeyAfter).type === TRANSCRIPT_SPACE)) {
      return false;
    }
    return true;
  }

  handlePastedText() {
    return true;
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
  onTranscriptUpdate: React.PropTypes.func,
};

export default TranscriptEditor;
