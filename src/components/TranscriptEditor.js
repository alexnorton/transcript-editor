import React, { Component } from 'react';
import { Editor, EditorState, Entity, CompositeDecorator, CharacterMetadata, getDefaultKeyBinding } from 'draft-js';
import Immutable from 'immutable';
import debounce from 'lodash.debounce';
import { Transcript } from 'transcript-model';

import convertFromTranscript from '../helpers/convertFromTranscript';
import convertToTranscript from '../helpers/convertToTranscript';
import updateBlock from '../helpers/updateBlock';
import TranscriptEditorBlock from './TranscriptEditorBlock';
import TranscriptEditorWord from './TranscriptEditorWord';
import TranscriptEditorSpace from './TranscriptEditorSpace';
import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE }
  from '../helpers/TranscriptEntities';

import '../css/TranscriptEditor.css';

class TranscriptEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      speakers: [],
      disabled: props.disabled || false,
      showSpeakers: props.showSpeakers || false,
    };

    this.onChange = this.onChange.bind(this);
    this.handleBeforeInput = this.handleBeforeInput.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.blockRenderer = this.blockRenderer.bind(this);
    this.handleKeyboardEvent = this.handleKeyboardEvent.bind(this);

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
            return entityType === TRANSCRIPT_WORD;
          }, callback);
        },
        component: TranscriptEditorWord,
      },
      {
        strategy: (contentBlock, callback) => {
          contentBlock.findEntityRanges((character) => {
            const entityKey = character.getEntity();
            if (entityKey === null) {
              return false;
            }
            const entityType = Entity.get(entityKey).getType();
            return entityType === TRANSCRIPT_SPACE;
          }, callback);
        },
        component: TranscriptEditorSpace,
      },
    ]);
  }

  componentWillMount() {
    if (this.props.transcript) {
      this.instantiateEditor(this.props.transcript);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      disabled: nextProps.disabled || false,
    });

    const transcript = nextProps.transcript;
    if (transcript && this.state.transcript !== transcript) {
      this.instantiateEditor(transcript);
    }
  }

  onChange(editorState) {
    if (this.state.disabled) {
      return;
    }

    const contentState = editorState.getCurrentContent();
    const previousEditorState = this.state.editorState;
    const lastChangeType = editorState.getLastChangeType();

    const selectionState = editorState.getSelection();
    const previousSelectionState = previousEditorState.getSelection();

    if (this.props.onSelectionChange && selectionState !== previousSelectionState) {
      this.sendSelectionChange(contentState, selectionState);
    }

    if (lastChangeType !== 'undo' && contentState !== previousEditorState.getCurrentContent()) {
      const startKey = selectionState.getStartKey();
      const previousStartKey = previousSelectionState.getStartKey();

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

      this.debouncedSendTranscriptUpdate(newContentState, this.state.speakers);

      this.setState({
        editorState: EditorState.push(
          previousEditorState, newContentState, lastChangeType
        ),
      });
      return;
    }
    this.setState({
      editorState,
    });
  }

  instantiateEditor(transcript) {
    const { contentState, speakers } = convertFromTranscript(transcript);

    this.setState({
      editorState: EditorState.createWithContent(
        contentState,
        this.decorator
      ),
      speakers,
      transcript,
    });

    this.sendTranscriptUpdate(contentState, speakers);
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

  handleKeyboardEvent(e) {
    if (getDefaultKeyBinding(e)) {
      return getDefaultKeyBinding(e);
    }
    if (this.props.onKeyboardEvent) {
      this.props.onKeyboardEvent(e);
    }
    return null;
  }

  blockRenderer() {
    return {
      component: TranscriptEditorBlock,
      props: {
        speakers: this.state.speakers,
        showSpeakers: this.state.showSpeakers,
      },
    };
  }

  focus() {
    this.editor.focus();
  }

  sendTranscriptUpdate(contentState, speakers) {
    this.props.onTranscriptUpdate(convertToTranscript(contentState, speakers));
  }

  sendSelectionChange(contentState, selectionState) {
    const startKey = selectionState.isBackward
      ? selectionState.focusKey : selectionState.anchorKey;
    const startOffset = selectionState.isBackward
      ? selectionState.focusOffset : selectionState.anchorOffset;
    const endKey = selectionState.isBackward
      ? selectionState.anchorKey : selectionState.focusKey;
    const endOffset = selectionState.isBackward
      ? selectionState.anchorOffset : selectionState.focusOffset;

    const startEntityKey = contentState
      .getBlockForKey(startKey)
      .getEntityAt(startOffset);
    const endEntityKey = contentState
      .getBlockForKey(endKey)
      .getEntityAt(endOffset);

    const startEntity = startEntityKey && Entity.get(startEntityKey);
    const endEntity = endEntityKey && Entity.get(endEntityKey);

    this.props.onSelectionChange({
      startTime: startEntity && startEntity.data.start,
      startWordID: startEntity && startEntity.data.id,
      startBlockKey: startKey,
      startCharacterOffset: startOffset,
      endTime: endEntity && endEntity.data.end,
      endID: endEntity && endEntity.data.id,
      endBlockKey: endKey,
      endCharacterOffset: endOffset,
    });
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

  // eslint-disable-next-line
  handlePastedText() {
    return true;
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="transcript-editor">
        <Editor
          ref={(editor) => { this.editor = editor; }}
          editorState={editorState}
          onChange={this.onChange}
          handleReturn={this.handleReturn}
          handleBeforeInput={this.handleBeforeInput}
          keyBindingFn={this.handleKeyboardEvent}
          handlePastedText={this.handlePastedText}
          blockRendererFn={this.blockRenderer}
        />
      </div>
    );
  }
}

TranscriptEditor.propTypes = {
  transcript: React.PropTypes.instanceOf(Transcript),
  onTranscriptUpdate: React.PropTypes.func,
  onSelectionChange: React.PropTypes.func,
  disabled: React.PropTypes.bool,
  onKeyboardEvent: React.PropTypes.func,
  showSpeakers: React.PropTypes.bool,
};

export default TranscriptEditor;
