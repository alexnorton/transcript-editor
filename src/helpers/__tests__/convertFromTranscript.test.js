import fs from 'fs';
import path from 'path';
import { Transcript } from 'transcript-model';
import { convertToRaw } from 'draft-js';

import convertFromTranscript from '../convertFromTranscript';

describe('convertFromTranscript()', () => {
  it('converts transcript to contentState and speakers', () => {
    const transcriptJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'transcript.json')));
    const transcript = Transcript.fromJSON(transcriptJson);

    const { editorState, speakers } = convertFromTranscript(transcript);

    const contentState = editorState.getCurrentContent();

    const raw = convertToRaw(contentState);

    Object.keys(raw.entityMap).forEach((key) => {
      delete raw.entityMap[key].data.id;
    });

    expect(raw).toEqual(
      JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'raw.json')))
    );

    expect(speakers.toJSON()).toEqual(
      JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'speakers.json')))
    );
  });
});
