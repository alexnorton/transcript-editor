import Immutable from 'immutable';
import { Entity, CharacterMetadata } from 'draft-js';

import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE, TRANSCRIPT_PLACEHOLDER }
  from '../helpers/TranscriptEntities';

const updateBlock = (contentBlock, previousContentBlock) => {
  return contentBlock.characterList.reduce(({ characterList, text }, character, index) => {
    // Is this the first character?
    if (!characterList.isEmpty()) {
      const previousCharacter = characterList.last();

      // Does the previous character have an entity?
      if (previousCharacter.entity) {
        // Does the previous character have a different entity?
        if (character.entity) {
          const entity = Entity.get(character.entity);
          const previousEntity = Entity.get(previousCharacter.entity);

          if (character.entity !== previousCharacter.entity) {
            // Does the different entity have the same type?
            if (entity.type === previousEntity.type && entity !== previousEntity) {
              // Merge the entities
              Entity.mergeData(previousCharacter.entity, { end: entity.data.end });

              return {
                characterList: characterList.push(
                  CharacterMetadata.applyEntity(character, previousCharacter.entity)
                ),
                text: text + contentBlock.text[index],
              };
            }
          // Otherwise do we have two spaces?
          } else if (entity.type === TRANSCRIPT_SPACE) {
            const previousStateEntity = Entity.get(previousContentBlock.getEntityAt(index));

            // Have we just deleted a word?
            if (previousStateEntity.type === TRANSCRIPT_WORD) {
              // Add a placeholder
              return {
                characterList: characterList
                  .push(CharacterMetadata.applyEntity(
                    CharacterMetadata.create(),
                    Entity.create(
                      TRANSCRIPT_PLACEHOLDER, 'IMMUTABLE', previousStateEntity.data
                    )
                  ))
                  .push(character),
                text: `${text}\u200C `,
              };
            }

            // Remove a space
            return {
              characterList,
              text,
            };
          }
        }
      } else {
        // Set it to the entity of this character
        return {
          characterList: characterList
            .set(-1, CharacterMetadata.applyEntity(previousCharacter, character.entity))
            .push(character),
          text: text + contentBlock.text[index],
        };
      }
    }

    return {
      characterList: characterList.push(character),
      text: text + contentBlock.text[index],
    };
  }, { characterList: new Immutable.List(), text: '' });
};

export default updateBlock;
