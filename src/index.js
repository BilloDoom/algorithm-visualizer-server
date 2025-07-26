// src/index.js
import { compileAndRun } from './runner.js';
import { readFileSync } from 'fs';

const inputCode = readFileSync('./examples/test.algv', 'utf8');
const result = compileAndRun(inputCode);

console.log('=== Transpiled JS ===');
console.log(result.transpiled);
console.log('\n=== Output ===');
console.log(result.output.join('\n'));
