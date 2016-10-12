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
  let newContentBlock;

  if (contentBlock.getLength() < previousContentBlock.getLength()) {
    newContentBlock = contentBlock.characterList.reduce(
      ({ characterList, text }, character, index) => {
        if (characterList.size > 0
          && Entity.get(characterList.last().entity).type === TRANSCRIPT_SPACE
          && Entity.get(character.entity).type === TRANSCRIPT_SPACE
          && Entity.get(
            previousContentBlock.characterList.get(index).entity
          ).type === TRANSCRIPT_WORD) {
          triggered = true;

          const deletedEntity = Entity.get(previousContentBlock.characterList.get(index).entity);

          return {
            characterList: characterList
              .push(CharacterMetadata.applyEntity(
                CharacterMetadata.create(),
                Entity.create(
                  TRANSCRIPT_PLACEHOLDER, 'IMMUTABLE', deletedEntity.data
                )
              ))
              .push(character),
            text: `${text}\u200C${contentBlock.text[index]}`,
          };
        }

        return {
          characterList: characterList.push(character),
          text: text + contentBlock.text[index],
        };
      }, { characterList: new Immutable.List(), text: '' }
    );
  }

  return triggered && newContentBlock;
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
