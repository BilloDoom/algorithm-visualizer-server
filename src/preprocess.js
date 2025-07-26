export function preprocess(code) {
    const lines = code.split('\n');
    const INDENT = '>>>>';
    const DEDENT = '<<<<';

    let indentStack = [0];
    const output = [];

    for (let rawLine of lines) {
        const line = rawLine.replace(/\r/g, '');
        const trimmed = line.trim();

        if (trimmed === '' || trimmed.startsWith('#')) continue;

        const indentMatch = line.match(/^ */);
        const indent = indentMatch ? indentMatch[0].length : 0;

        const currentIndent = indentStack[indentStack.length - 1];

        if (indent > currentIndent) {
            indentStack.push(indent);
            output.push(INDENT);
        } else {
            while (indent < indentStack[indentStack.length - 1]) {
                indentStack.pop();
                output.push(DEDENT);
            }

            if (indent !== indentStack[indentStack.length - 1]) {
                throw new Error(`Inconsistent indentation at line: "${line}"`);
            }
        }
        output.push(trimmed);
    }

    while (indentStack.length > 1) {
        indentStack.pop();
        output.push(DEDENT);
    }

    return output.join('\n');
}
