import React, { Component } from 'react';
import { Editor, EditorState, CharacterMetadata, getDefaultKeyBinding } from 'draft-js';
import Immutable from 'immutable';
import PropTypes from 'prop-types';

import updateBlock from '../helpers/updateBlock';
import TranscriptEditorBlock from './TranscriptEditorBlock';
import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE } from '../helpers/TranscriptEntities';

class TranscriptEditor extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleBeforeInput = this.handleBeforeInput.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.blockRenderer = this.blockRenderer.bind(this);
    this.handleKeyboardEvent = this.handleKeyboardEvent.bind(this);
  }

  onChange(editorState) {
    if (this.props.disabled) {
      return;
    }

    const previousEditorState = this.props.editorState;
    const lastChangeType = editorState.getLastChangeType();

    const selectionState = editorState.getSelection();
    const previousSelectionState = previousEditorState.getSelection();

    let contentState = editorState.getCurrentContent();

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
            if (
              contentState.getEntity(newContentBlock.characterList.get(startOffset).entity).type ===
                TRANSCRIPT_WORD &&
              contentState.getEntity(newContentBlock.characterList.get(startOffset - 1).entity)
                .type === TRANSCRIPT_WORD
            ) {
              // Add a space
              newContentBlock = newContentBlock
                .set(
                  'characterList',
                  newContentBlock.characterList.insert(
                    startOffset,
                    CharacterMetadata.applyEntity(
                      CharacterMetadata.create(),
                      (() => {
                        contentState = contentState.createEntity(
                          'TRANSCRIPT_SPACE',
                          'IMMUTABLE',
                          null,
                        );
                        return contentState.getLastCreatedEntityKey();
                      })(),
                    ),
                  ),
                )
                .set(
                  'text',
                  `${newContentBlock.text.slice(0, startOffset)}` +
                    ` ${newContentBlock.text.slice(startOffset)}`,
                );
            }
          }

          // Update the entities
          newContentBlock = newContentBlock.merge(updateBlock(newContentBlock, contentState));

          // Have we created a leading space? (e.g. when splitting a block)
          if (
            contentState.getEntity(newContentBlock.characterList.first().entity).type ===
            TRANSCRIPT_SPACE
          ) {
            // Remove the leading space
            newContentBlock = newContentBlock
              .set('characterList', newContentBlock.characterList.shift())
              .set('text', newContentBlock.text.substring(1));
          }

          // Is this block missing data? (e.g. it's been split)
          if (newContentBlock.data.isEmpty()) {
            // Copy the previous block's data
            newContentBlock = newContentBlock.set('data', _newBlockMap.last().data);
          }
          // Otherwise is this the block previously being edited? (e.g. that was split)
        } else if (blockKey === previousStartKey) {
          // Have we created a trailing space?
          if (
            contentState.getEntity(newContentBlock.characterList.last().entity).type ===
            TRANSCRIPT_SPACE
          ) {
            // Remove the trailing space
            newContentBlock = newContentBlock
              .set('characterList', newContentBlock.characterList.pop())
              .set('text', newContentBlock.text.substring(0, newContentBlock.text.length - 1));
          }
        }

        return _newBlockMap.set(blockKey, newContentBlock);
      }, new Immutable.OrderedMap());

      contentState = contentState.set('blockMap', newBlockMap);

      this.props.onChange({
        editorState: EditorState.push(previousEditorState, contentState, lastChangeType),
        speakers: this.props.speakers,
      });
      return;
    }
    this.props.onChange({
      editorState,
      speakers: this.props.speakers,
    });
  }

  handleBeforeInput(chars) {
    // Don't allow inserting additional spaces between words
    if (chars === ' ') {
      const { editorState } = this.props;
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const startKey = selectionState.getStartKey();
      const startOffset = selectionState.getStartOffset();
      const selectedBlock = editorState.getCurrentContent().getBlockForKey(startKey);
      const entityKeyBefore = selectedBlock.getEntityAt(startOffset - 1);
      if (entityKeyBefore && contentState.getEntity(entityKeyBefore).type === TRANSCRIPT_SPACE) {
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
        speakers: this.props.speakers,
        showSpeakers: this.props.showSpeakers,
      },
    };
  }

  focus() {
    this.editor.focus();
  }

  sendSelectionChange(contentState, selectionState) {
    const startKey = selectionState.isBackward ? selectionState.focusKey : selectionState.anchorKey;
    const startOffset = selectionState.isBackward
      ? selectionState.focusOffset
      : selectionState.anchorOffset;
    const endKey = selectionState.isBackward ? selectionState.anchorKey : selectionState.focusKey;
    const endOffset = selectionState.isBackward
      ? selectionState.anchorOffset
      : selectionState.focusOffset;

    const startEntityKey = contentState.getBlockForKey(startKey).getEntityAt(startOffset);
    const endEntityKey = contentState.getBlockForKey(endKey).getEntityAt(endOffset);

    const startEntity = startEntityKey && contentState.getEntity(startEntityKey);
    const endEntity = endEntityKey && contentState.getEntity(endEntityKey);

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
    const { editorState } = this.props;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const startKey = selectionState.getStartKey();
    const startOffset = selectionState.getStartOffset();
    const selectedBlock = editorState.getCurrentContent().getBlockForKey(startKey);
    const entityKeyBefore = selectedBlock.getEntityAt(startOffset - 1);
    const entityKeyAfter = selectedBlock.getEntityAt(startOffset);
    if (
      (entityKeyBefore && contentState.getEntity(entityKeyBefore).type === TRANSCRIPT_SPACE) ||
      (entityKeyAfter && contentState.getEntity(entityKeyAfter).type === TRANSCRIPT_SPACE)
    ) {
      return false;
    }
    return true;
  }

  // eslint-disable-next-line
  handlePastedText() {
    return true;
  }

  render() {
    const { editorState } = this.props;
    return (
      <div className="transcript-editor">
        <Editor
          ref={(editor) => {
            this.editor = editor;
          }}
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
  editorState: PropTypes.instanceOf(EditorState),
  speakers: PropTypes.instanceOf(Immutable.List),
  onChange: PropTypes.func.isRequired,
  onSelectionChange: PropTypes.func,
  onKeyboardEvent: PropTypes.func,
  disabled: PropTypes.bool,
  showSpeakers: PropTypes.bool,
};

TranscriptEditor.defaultProps = {
  editorState: EditorState.createEmpty(),
  speakers: new Immutable.List(),
  onSelectionChange: null,
  onKeyboardEvent: null,
  disabled: false,
  showSpeakers: false,
};

export default TranscriptEditor;
