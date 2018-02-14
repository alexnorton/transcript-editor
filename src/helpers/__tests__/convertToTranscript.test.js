import fs from 'fs';
import path from 'path';
import { convertFromRaw } from 'draft-js';
import { List } from 'immutable';

import convertToTranscript from '../convertToTranscript';

describe('convertToTranscript()', () => {
  it('converts contentState and speakers to transcript', () => {
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'raw.json')));
    const speakers = new List(JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'speakers.json'))));

    const contentState = convertFromRaw(raw);

    const transcript = convertToTranscript(contentState, speakers);

    expect(transcript.toJSON()).toEqual(JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'transcript.json'))));
  });
});
