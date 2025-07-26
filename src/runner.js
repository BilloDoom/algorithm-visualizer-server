import { parse } from './parser.js';
import { transpile } from './transpiler.js';

export function compileAndRun(code) {
  const ast = parse(code);
  const jsCode = transpile(ast);

  // Optional: capture console output
  const output = [];
  const originalLog = console.log;
  console.log = (...args) => output.push(args.join(' '));

  try {
    const func = new Function(jsCode);
    func();
  } finally {
    console.log = originalLog; // Restore console
  }

  return {
    transpiled: jsCode,
    output,
  };
}
