import { parse } from './parser.js';
import { readFileSync } from 'fs';
import { interpret } from './interpreter.js';

const code = readFileSync('./examples/test.pseudo', 'utf8');

try {
    const ast = parse(code);
    console.log('Parsed AST:');
    console.log(JSON.stringify(ast, null, 2));
    console.log('\nProgram Output:');
    interpret(ast);
} catch (e) {
    console.error('Error:', e.message);
}