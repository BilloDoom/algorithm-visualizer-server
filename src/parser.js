import peg from 'peggy';
import { readFileSync } from 'fs';
import { preprocess } from './preprocess.js';

const grammar = readFileSync('./grammar/pseudolang.pegjs', 'utf8');
const parser = peg.generate(grammar);

export function parse(code) {
  const preprocessed = preprocess(code);
  return parser.parse(preprocessed);
}