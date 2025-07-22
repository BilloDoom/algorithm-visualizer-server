import peg from 'pegjs';
import { readFileSync } from 'fs';
import { preprocess } from './preprocess.js';

const grammar = readFileSync('./grammar/pseudolang.pegjs', 'utf8');
const parser = peg.generate(grammar);

export function parse(code) {
  const preprocessed = preprocess(code);
  console.log('Preprocessed Code:');
  console.log(preprocessed);
  console.log(preprocessed.split('\n'));
  return parser.parse(preprocessed);
}