import Immutable from 'immutable';
import { Entity, CharacterMetadata } from 'draft-js';

import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE, TRANSCRIPT_PLACEHOLDER }
  from './TranscriptEntities';

const ruleAddToStartOfWord = ({ contentBlock }) => {
  let triggered = false;

  const newContentBlock = contentBlock.characterList.reduceRight(
    ({ characterList, text }, character, index) => {
      if (!character.entity) {
        triggered = true;
        return {
          characterList: characterList.insert(0,
            CharacterMetadata.applyEntity(character, characterList.get(0).entity)
          ),
          text: contentBlock.text[index] + text,
        };
      }
      return {
        characterList: characterList.insert(0, character),
        text: contentBlock.text[index] + text,
      };
    }, { characterList: new Immutable.List(), text: '' }
  );

  return triggered && newContentBlock;
};

const rulePreventMultipleSpaces = () => {};

const ruleMergeAdjacentWords = ({ contentBlock }) => {
  let triggered = false;

  const newContentBlock = contentBlock.characterList.reduce(
    ({ characterList, text }, character, index) => {
      if (characterList.last()
        && characterList.last().entity
        && character.entity
        && characterList.last().entity !== character.entity) {
        const entity = Entity.get(character.entity);
        const previousEntity = Entity.get(characterList.last().entity);
        if (entity.type === TRANSCRIPT_WORD && previousEntity.type === TRANSCRIPT_WORD) {
          triggered = true;
          Entity.mergeData(characterList.last().entity, { end: entity.data.end });
          return {
            characterList: characterList.push(
              CharacterMetadata.applyEntity(character, characterList.last().entity)
            ),
            text: text + contentBlock.text[index],
          };
        }
      }
      return {
        characterList: characterList.push(character),
        text: text + contentBlock.text[index],
      };
    }, { characterList: new Immutable.List(), text: '' }
  );

  return triggered && newContentBlock;
};

const ruleInsertPlaceholderOnWordDeleteAtStart = ({ contentBlock, previousContentBlock }) => {
  if (contentBlock.getLength() < previousContentBlock.getLength()
    && Entity.get(contentBlock.characterList.first().entity).type === TRANSCRIPT_SPACE) {
    const deletedEntity = Entity.get(previousContentBlock.characterList.first().entity);

    return {
      characterList: contentBlock.characterList.insert(
        0, CharacterMetadata.applyEntity(
          CharacterMetadata.create(),
          Entity.create(
            TRANSCRIPT_PLACEHOLDER, 'IMMUTABLE', deletedEntity.data
          )
        )
      ),
      text: `\u200C${contentBlock.text}`,
    };
  }

  return false;
};

const ruleInsertPlaceholderOnWordDeleteInMiddle = ({ contentBlock, previousContentBlock }) => {
  let triggered = false;


  if (contentBlock.getLength() < previousContentBlock.getLength()) {
    // If the first character of the block is a space


    // If the last character of the block is a space

    // contentBlock.characterList.reduce(
    //   ({ characterList, text }, character, index) => {
    //     if (characterList.last()
    //       && characterList.last().entity
    //       && character.entity
    //       && characterList.last().entity !== character.entity) {
    //   }, { characterList: new Immutable.List(), text: '' }
    // );
  }

  return triggered && contentBlock;
};

const ruleInsertPlaceholderOnWordDeleteAtEnd = ({ contentBlock, previousContentBlock }) => {
  if (contentBlock.getLength() < previousContentBlock.getLength()
    && Entity.get(contentBlock.characterList.last().entity).type === TRANSCRIPT_SPACE) {
    const deletedEntity = Entity.get(previousContentBlock.characterList.last().entity);
    if (deletedEntity.type === TRANSCRIPT_WORD) {
      return {
        characterList: contentBlock.characterList.push(
          CharacterMetadata.applyEntity(
            CharacterMetadata.create(),
            Entity.create(
              TRANSCRIPT_PLACEHOLDER, 'IMMUTABLE', deletedEntity.data
            )
          )
        ),
        text: `${contentBlock.text}\u200C`,
      };
    }
  }

  return false;
};

const ruleMergeSpaces = () => {};

const ruleReplacePlaceholderOnTextEntry = () => {};

const updateBlock = (contentBlock, previousContentBlock) => {
  const rules = [
    ruleAddToStartOfWord,
    rulePreventMultipleSpaces,
    ruleMergeAdjacentWords,
    ruleInsertPlaceholderOnWordDeleteAtStart,
    ruleInsertPlaceholderOnWordDeleteInMiddle,
    ruleInsertPlaceholderOnWordDeleteAtEnd,
    ruleMergeSpaces,
    ruleReplacePlaceholderOnTextEntry,
  ];

  let newContentBlock;

  rules.some(rule => (
    newContentBlock = rule({ contentBlock, previousContentBlock })
  ));

  return newContentBlock || contentBlock;
};

export default updateBlock;
